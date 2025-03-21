import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createCategory } from '../../lib/api';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

export default function NewCategory() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    uniqId: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const generateUniqId = () => {
    // Convert name to lowercase, replace spaces with hyphens, and remove special characters
    const uniqId = formData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    setFormData({
      ...formData,
      uniqId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      setError('Category name is required');
      return;
    }
    
    if (!formData.uniqId) {
      setError('Unique ID is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await createCategory(formData);
      router.push('/categories');
    } catch (err) {
      console.error('Failed to create category:', err);
      setError('Failed to create category. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Add New Category - Cafe Admin</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600 mt-1">Create a new menu category</p>
        </div>
        <button
          onClick={() => router.back()}
          className="btn flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
          className="mb-6"
        />
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="form-label">
              Category Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => {
                if (formData.name && !formData.uniqId) {
                  generateUniqId();
                }
              }}
              className="form-input border rounded-md w-full py-2 px-3"
              placeholder="e.g. Hot Drinks"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="uniqId" className="form-label">
              Unique ID*
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="uniqId"
                name="uniqId"
                value={formData.uniqId}
                onChange={handleChange}
                className="form-input border rounded-md w-full py-2 px-3"
                placeholder="e.g. hot-drinks"
                required
              />
              <button
                type="button"
                onClick={generateUniqId}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This ID will be used in API calls and should be unique and URL-friendly
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Inactive categories will not be shown to customers
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⌛</span> Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Category
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}