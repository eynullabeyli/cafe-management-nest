import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { fetchCategory, updateCategory } from '../../../lib/api';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

export default function EditCategory() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    name: '',
    isActive: true
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (id) {
      loadCategory(id);
    }
  }, [id]);

  const loadCategory = async (categoryId) => {
    try {
      setLoading(true);
      const data = await fetchCategory(categoryId);
      setFormData({
        name: data.name,
        isActive: data.isActive
      });
      setOriginalData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load category:', err);
      setError('Failed to load category. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      setError('Category name is required');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await updateCategory(id, formData);
      setSuccessMessage('Category updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update category:', err);
      setError('Failed to update category. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p>Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Edit Category - Cafe Admin</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-600 mt-1">
            {originalData ? `Editing: ${originalData.name}` : 'Update category details'}
          </p>
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

      {successMessage && (
        <Alert 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
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
              className="form-input border rounded-md w-full py-2 px-3"
              placeholder="e.g. Hot Drinks"
              required
            />
          </div>

          {originalData && (
            <div className="mb-4">
              <label className="form-label">Unique ID</label>
              <input
                type="text"
                value={originalData.uniqId}
                className="form-input border rounded-md w-full py-2 px-3 bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Unique ID cannot be changed after creation
              </p>
            </div>
          )}

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
              disabled={saving}
              className="btn btn-primary flex items-center"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⌛</span> Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}