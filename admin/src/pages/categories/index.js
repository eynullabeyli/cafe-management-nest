import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchCategories, deleteCategory } from '../../lib/api';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, pending: false });
  const [successMessage, setSuccessMessage] = useState(null);

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

  return (
    <div>
      <Head>
        <title>Categories - Cafe Admin</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your menu categories</p>
        </div>
        <Link 
          href="/categories/new"
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" /> Add New
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

      <Card>
        {loading ? (
          <div className="text-center py-4">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No categories found</p>
            <Link 
              href="/categories/new"
              className="btn btn-primary"
            >
              Add your first category
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
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{category.uniqId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/categories/edit/${category._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={deleteStatus.pending && deleteStatus.id === category._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteStatus.pending && deleteStatus.id === category._id ? (
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