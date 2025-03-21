import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchItems, deleteItem, fetchCategories } from '../../lib/api';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';

export default function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, pending: false });
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    activeOnly: false,
    categoryUniqId: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      
      // First load categories
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      
      // Create a mapping of categoryUniqId to category name for easy reference
      const catMap = {};
      categoriesData.forEach(cat => {
        catMap[cat.uniqId] = cat.name;
      });
      setCategoryMap(catMap);
      
      // Load items based on current filters
      let itemsData;
      if (searchTerm) {
        itemsData = await searchItems();
      } else {
        itemsData = await fetchItems({
          activeOnly: filters.activeOnly || undefined,
        });
        
        // If category filter is active, filter items client-side
        if (filters.categoryUniqId) {
          itemsData = itemsData.filter(item => 
            item.categoryUniqId === filters.categoryUniqId
          );
        }
      }
      
      setItems(itemsData);
      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async () => {
    try {
      const response = await fetch(`/api/items/search/name?nameQuery=${searchTerm}&activeOnly=${filters.activeOnly || false}`);
      const data = await response.json();
      
      // Apply category filter if selected
      if (filters.categoryUniqId) {
        return data.filter(item => item.categoryUniqId === filters.categoryUniqId);
      }
      
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.activeOnly, filters.categoryUniqId]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setDeleteStatus({ id, pending: true });
        await deleteItem(id);
        await loadData();
        setSuccessMessage('Item deleted successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error('Failed to delete item:', err);
        setError('Failed to delete item. Please try again later.');
      } finally {
        setDeleteStatus({ id: null, pending: false });
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div>
      <Head>
        <title>Menu Items - Cafe Admin</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-600 mt-1">Manage your menu items</p>
        </div>
        <Link href="/items/new">
          <a className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" /> Add New
          </a>
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

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4 md:mb-0">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input py-2 pl-10 w-full border rounded-md"
                  placeholder="Search items by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="ml-2 btn btn-primary py-2"
              >
                Search
              </button>
            </form>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <FiFilter className="mr-2 text-gray-500" />
              <select
                name="categoryUniqId"
                value={filters.categoryUniqId}
                onChange={handleFilterChange}
                className="form-input py-2 border rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.uniqId} value={category.uniqId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="activeOnly"
                name="activeOnly"
                checked={filters.activeOnly}
                onChange={handleFilterChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="activeOnly" className="ml-2 block text-sm text-gray-700">
                Active Items Only
              </label>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="text-center py-4">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No items found</p>
            <Link href="/items/new">
              <a className="btn btn-primary">Add your first item</a>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.imageUrl && (
                          <img
                            className="h-10 w-10 rounded-full mr-3 object-cover"
                            src={item.imageUrl}
                            alt={item.name}
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                          {item.isNew && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {categoryMap[item.categoryUniqId] || item.categoryUniqId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/items/edit/${item._id}`}>
                          <a className="text-blue-600 hover:text-blue-900">
                            <FiEdit2 className="h-5 w-5" />
                          </a>
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleteStatus.pending && deleteStatus.id === item._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteStatus.pending && deleteStatus.id === item._id ? (
                            <span className="animate-spin">⌛</span>
                          ) : (
                            <FiTrash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}