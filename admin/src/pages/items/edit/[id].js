import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { fetchItem, updateItem, fetchCategories } from '../../../lib/api';
import Card from '../../../components/Card';
import Alert from '../../../components/Alert';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryUniqId: '',
    imageUrl: '',
    isNew: false,
    isActive: true
  });
  const [originalData, setOriginalData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (id) {
      loadItemAndCategories(id);
    }
  }, [id]);

  const loadItemAndCategories = async (itemId) => {
    try {
      setLoading(true);
      
      // Load categories and item data in parallel
      const [categoriesData, itemData] = await Promise.all([
        fetchCategories(),
        fetchItem(itemId)
      ]);
      
      setCategories(categoriesData);
      setOriginalData(itemData);
      
      // Set form data from the fetched item
      setFormData({
        name: itemData.name,
        description: itemData.description || '',
        price: itemData.price.toString(),
        categoryUniqId: itemData.categoryUniqId,
        imageUrl: itemData.imageUrl || '',
        isNew: itemData.isNew,
        isActive: itemData.isActive
      });
      
      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load item data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'price') {
      // Allow only numbers and a single decimal point
      if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      setError('Item name is required');
      return;
    }
    
    if (!formData.price) {
      setError('Price is required');
      return;
    }
    
    if (!formData.categoryUniqId) {
      setError('Category is required');
      return;
    }
    
    // Convert price to a number
    const itemData = {
      ...formData,
      price: parseFloat(formData.price)
    };
    
    try {
      setSaving(true);
      setError(null);
      
      await updateItem(id, itemData);
      setSuccessMessage('Item updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update item:', err);
      setError('Failed to update item. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p>Loading item...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Edit Item - Cafe Admin</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Item</h1>
          <p className="text-gray-600 mt-1">
            {originalData ? `Editing: ${originalData.name}` : 'Update item details'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  Item Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input border rounded-md w-full py-2 px-3"
                  placeholder="e.g. Cappuccino"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="form-label">
                  Price*
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input border rounded-md w-full py-2 pl-3 pr-12"
                    placeholder="0.00"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">AZN</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="categoryUniqId" className="form-label">
                  Category*
                </label>
                <select
                  id="categoryUniqId"
                  name="categoryUniqId"
                  value={formData.categoryUniqId}
                  onChange={handleChange}
                  className="form-input border rounded-md w-full py-2 px-3"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(category => (
                    <option key={category.uniqId} value={category.uniqId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="imageUrl" className="form-label">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-input border rounded-md w-full py-2 px-3"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for the item image (optional)
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <div className="mb-4">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="form-input border rounded-md w-full py-2 px-3"
                  placeholder="Describe the item..."
                ></textarea>
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNew"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                    Mark as New
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  New items will be highlighted to customers
                </p>
              </div>

              <div className="mb-4">
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
                  Inactive items will not be shown to customers
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
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