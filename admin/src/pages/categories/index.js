import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchCategories, deleteCategory } from '../../lib/api';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { 
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, 
  FiGrid, FiFilter, FiRefreshCw, FiLayers 
} from 'react-icons/fi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, pending: false });
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      
      if (data) {
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } else {
        console.warn('No category data received from API');
        setCategories([]);
        setError('Failed to load categories. The API server might be unavailable.');
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories([]);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setDeleteStatus({ id, pending: true });
        await deleteCategory(id);
        await loadCategories();
        setSuccessMessage('Category deleted successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error('Failed to delete category:', err);
        setError('Failed to delete category. Please try again later.');
      } finally {
        setDeleteStatus({ id: null, pending: false });
      }
    }
  };

  // Filter categories based on the selected filter
  const filteredCategories = categories.filter(category => {
    if (filter === 'all') return true;
    if (filter === 'active') return category.isActive;
    if (filter === 'inactive') return !category.isActive;
    return true;
  });

  // Get count of active and inactive categories
  const activeCount = categories.filter(cat => cat.isActive).length;
  const inactiveCount = categories.filter(cat => !cat.isActive).length;

  return (
    <div>
      <Head>
        <title>Categories - Cafe Admin</title>
      </Head>

      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="text-gray-500 mt-1">Manage your menu categories</p>
        </div>
        <div className="dashboard-action-buttons">
          <Link 
            href="/categories/new"
            className="fancy-button primary"
          >
            <FiPlus className="mr-2 h-5 w-5" /> New Category
          </Link>
          <button 
            onClick={() => loadCategories()}
            className="fancy-button secondary"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="flex items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <FiLayers className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm text-blue-600 font-medium">Total Categories</h3>
            <p className="text-2xl font-semibold text-blue-800">{categories.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <FiCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm text-green-600 font-medium">Active Categories</h3>
            <p className="text-2xl font-semibold text-green-800">{activeCount}</p>
          </div>
        </Card>
        
        <Card className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="p-3 rounded-full bg-gray-100 text-gray-600 mr-4">
            <FiX className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm text-gray-600 font-medium">Inactive Categories</h3>
            <p className="text-2xl font-semibold text-gray-800">{inactiveCount}</p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${filter === 'all' 
            ? 'text-blue-600 border-b-2 border-blue-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setFilter('all')}
        >
          All ({categories.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${filter === 'active' 
            ? 'text-green-600 border-b-2 border-green-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${filter === 'inactive' 
            ? 'text-gray-600 border-b-2 border-gray-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setFilter('inactive')}
        >
          Inactive ({inactiveCount})
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FiRefreshCw className="animate-spin h-8 w-8 text-blue-500 mr-2" />
            <p className="text-gray-600">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 inline-flex mb-4">
              <FiGrid className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {filter !== 'all' 
                ? `No ${filter} categories found. Try changing the filter or add a new category.` 
                : 'Start creating categories to organize your menu items.'}
            </p>
            <Link 
              href="/categories/new"
              className="fancy-button primary inline-flex"
            >
              <FiPlus className="mr-2" /> Add New Category
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
                    Unique ID
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
                {filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono bg-gray-100 text-gray-800 py-1 px-2 rounded inline-block">
                        {category.uniqId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${category.isActive 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link 
                          href={`/categories/edit/${category._id}`}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors duration-150"
                          title="Edit Category"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={deleteStatus.pending && deleteStatus.id === category._id}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors duration-150 disabled:opacity-50"
                          title="Delete Category"
                        >
                          {deleteStatus.pending && deleteStatus.id === category._id ? (
                            <FiRefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="h-4 w-4" />
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