import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchItems, fetchCategories, deleteItem } from '../../lib/api';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function Items() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load items and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories first to build the lookup map
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Create a map for easy lookups
        const catMap = {};
        categoriesData.forEach(cat => {
          catMap[cat.uniqId] = cat.name;
        });
        setCategoryMap(catMap);
        
        // Fetch items based on active filter
        const itemsData = await fetchItems({ 
          activeOnly: showActiveOnly 
        });
        setItems(itemsData);
        
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load items. The server might be unavailable.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [showActiveOnly]);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchTerm) {
        // If search is cleared, reload all items
        try {
          setLoading(true);
          const itemsData = await fetchItems({ 
            activeOnly: showActiveOnly 
          });
          setItems(itemsData);
          setCurrentFilter(null);
        } catch (err) {
          console.error('Failed to load items after search cleared:', err);
          setError('Failed to load items. Please try again.');
        } finally {
          setLoading(false);
        }
        return;
      }
      
      try {
        setLoading(true);
        const searchResults = await searchItemsByName(searchTerm, {
          activeOnly: showActiveOnly
        });
        setItems(searchResults);
        setCurrentFilter({ type: 'search', value: searchTerm });
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to search items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search to avoid too many API calls
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, showActiveOnly]);

  // Handle filtering by category
  const handleFilterByCategory = async (categoryUniqId) => {
    if (currentFilter?.type === 'category' && currentFilter?.value === categoryUniqId) {
      // If clicking the same filter, clear it
      try {
        setLoading(true);
        const itemsData = await fetchItems({ 
          activeOnly: showActiveOnly 
        });
        setItems(itemsData);
        setCurrentFilter(null);
      } catch (err) {
        console.error('Failed to clear category filter:', err);
        setError('Failed to clear filter. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    try {
      setLoading(true);
      const filteredItems = await fetchItemsByCategory(categoryUniqId, showActiveOnly);
      setItems(filteredItems);
      setCurrentFilter({ type: 'category', value: categoryUniqId });
    } catch (err) {
      console.error('Failed to filter by category:', err);
      setError('Failed to filter items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const clearFilters = async () => {
    setSearchTerm('');
    setCurrentFilter(null);
    
    try {
      setLoading(true);
      const itemsData = await fetchItems({ 
        activeOnly: showActiveOnly 
      });
      setItems(itemsData);
    } catch (err) {
      console.error('Failed to clear filters:', err);
      setError('Failed to clear filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete item
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setDeleteInProgress(true);
      await deleteItem(itemToDelete._id);
      
      // Remove item from list
      setItems(items.filter(item => item._id !== itemToDelete._id));
      setSuccessMessage(`"${itemToDelete.name}" has been deleted successfully.`);
      
      // Reset state
      setItemToDelete(null);
      setShowDeleteConfirm(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete item. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteInProgress(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Items - Cafe Admin</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-600 mt-1">
            {loading ? 'Loading...' : `${items.length} items found`}
            {currentFilter && (
              <span> • Filtered by {currentFilter.type === 'search' ? 'search' : 'category'}</span>
            )}
          </p>
        </div>
        <Link
          href="/items/new"
          className="btn btn-primary"
        >
          <FiPlus className="mr-2" /> Add Item
        </Link>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
          className="mb-6"
        />
      )}

      {successMessage && (
        <Alert 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
          className="mb-6"
        />
      )}

      {/* Filters and search */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
          <div className="relative flex-1 md:mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10 block w-full rounded-md border"
              placeholder="Search items by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <button
                type="button"
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className={`
                  inline-flex items-center px-3 py-2 border rounded-md text-sm
                  ${showActiveOnly ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-300'}
                `}
              >
                <FiFilter className="mr-2 h-4 w-4" />
                {showActiveOnly ? 'Active Only' : 'All Items'}
              </button>
            </div>
            {currentFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 bg-white rounded-md text-sm text-gray-700"
              >
                <FiX className="mr-2 h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.uniqId}
            onClick={() => handleFilterByCategory(category.uniqId)}
            className={`
              px-3 py-1 text-xs font-medium rounded-full
              ${currentFilter?.type === 'category' && currentFilter?.value === category.uniqId
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
              ${!category.isActive && 'opacity-60'}
            `}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Items list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow p-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-500 mb-4">
            {currentFilter 
              ? 'Try adjusting your filters or search term' 
              : 'Get started by adding your first menu item'}
          </p>
          <Link
            href="/items/new"
            className="btn btn-primary"
          >
            <FiPlus className="mr-2" /> Add First Item
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id} className={!item.isActive ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.imageUrl ? (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img className="h-10 w-10 rounded-md object-cover" src={item.imageUrl} alt={item.name} />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                          <FiCoffee className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.name}
                          {item.isNew && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              NEW
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categoryMap[item.categoryUniqId] || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/items/edit/${item._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FiEdit className="inline-block h-4 w-4" /> Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="inline-block h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Item
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                  disabled={deleteInProgress}
                >
                  {deleteInProgress ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteInProgress}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}