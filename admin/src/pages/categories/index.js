import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchCategories, deleteCategory, toggleCategoryActive } from '../../lib/api';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { 
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, 
  FiGrid, FiFilter, FiRefreshCw, FiLayers,
  FiToggleLeft, FiToggleRight
} from 'react-icons/fi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, pending: false });
  const [toggleStatus, setToggleStatus] = useState({ id: null, pending: false });
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
  
  const handleToggleActive = async (id, currentActive) => {
    try {
      setToggleStatus({ id, pending: true });
      await toggleCategoryActive(id, !currentActive);
      
      // Update the category in the local state to avoid a full reload
      const updatedCategories = categories.map(category => 
        category._id === id ? {...category, isActive: !currentActive} : category
      );
      setCategories(updatedCategories);
      
      setSuccessMessage(`Category ${!currentActive ? 'activated' : 'deactivated'} successfully.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to toggle category status:', err);
      setError('Failed to update category status. Please try again later.');
    } finally {
      setToggleStatus({ id: null, pending: false });
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



      {/* Stylish Filter Selector */}
      <div className="fancy-filter-container mb-6">
        <div className="fancy-filter">
          <div 
            className={`fancy-filter-option ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <div className="filter-icon all">
              <FiLayers />
            </div>
            <div className="filter-content">
              <span className="filter-label">All</span>
              <span className="filter-count">{categories.length}</span>
            </div>
            <div className="filter-indicator"></div>
          </div>
          
          <div 
            className={`fancy-filter-option ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            <div className="filter-icon active">
              <FiCheck />
            </div>
            <div className="filter-content">
              <span className="filter-label">Active</span>
              <span className="filter-count">{activeCount}</span>
            </div>
            <div className="filter-indicator"></div>
          </div>
          
          <div 
            className={`fancy-filter-option ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            <div className="filter-icon inactive">
              <FiX />
            </div>
            <div className="filter-content">
              <span className="filter-label">Inactive</span>
              <span className="filter-count">{inactiveCount}</span>
            </div>
            <div className="filter-indicator"></div>
          </div>
        </div>
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
          <div className="overflow-hidden rounded-lg">
            <div className="category-grid">
              {filteredCategories.map((category) => (
                <div key={category._id} className="category-card">
                  <div className="category-card-inner">
                    <div className="category-header">
                      <h3 className="category-title">{category.name}</h3>
                      <span 
                        className={`category-status ${category.isActive ? 'active' : 'inactive'}`}
                        title={category.isActive ? 'Active - Visible to customers' : 'Inactive - Hidden from customers'}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="category-id">
                      <span className="category-id-label">Unique ID:</span>
                      <code className="category-id-value">{category.uniqId}</code>
                    </div>
                    
                    <div className="category-meta">
                      <div className="category-meta-item">
                        <span className="meta-label">Created</span>
                        <span className="meta-value">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="category-meta-item">
                        <span className="meta-label">Last Updated</span>
                        <span className="meta-value">
                          {new Date(category.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Toggle switch for active/inactive status (only visible when 'all' filter is active) */}
                    {filter === 'all' && (
                      <div className="toggle-container">
                        <span className="toggle-label">
                          {category.isActive ? 'Category is active' : 'Category is inactive'}
                        </span>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox"
                            checked={category.isActive}
                            onChange={() => handleToggleActive(category._id, category.isActive)}
                            disabled={toggleStatus.pending && toggleStatus.id === category._id}
                          />
                          <span className="toggle-slider">
                            {toggleStatus.pending && toggleStatus.id === category._id && (
                              <div className="toggle-loading">
                                <div className="spinner"></div>
                              </div>
                            )}
                          </span>
                        </label>
                      </div>
                    )}
                    
                    <div className="category-actions">
                      <Link 
                        href={`/categories/edit/${category._id}`}
                        className="category-action edit"
                      >
                        <FiEdit2 className="action-icon" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        disabled={deleteStatus.pending && deleteStatus.id === category._id}
                        className="category-action delete"
                      >
                        {deleteStatus.pending && deleteStatus.id === category._id ? (
                          <>
                            <FiRefreshCw className="action-icon spin" />
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <FiTrash2 className="action-icon" />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}