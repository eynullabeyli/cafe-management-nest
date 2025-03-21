import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createItem, fetchCategories } from '../../lib/api';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

export default function NewItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryUniqId: '',
    imageUrl: '',
    isNew: true,
    isActive: true
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await fetchCategories(true); // Only get active categories
        setCategories(data);
        
        // Automatically select the first category if available
        if (data.length > 0 && !formData.categoryUniqId) {
          setFormData(prev => ({
            ...prev,
            categoryUniqId: data[0].uniqId
          }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, []);

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
      setLoading(true);
      setError(null);
      
      await createItem(itemData);
      router.push('/items');
    } catch (err) {
      console.error('Failed to create item:', err);
      setError('Failed to create item. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Add New Item - Cafe Admin</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
          <p className="text-gray-600 mt-1">Create a new menu item</p>
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input border rounded-md w-full py-2 pl-7 pr-3"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="categoryUniqId" className="form-label">
                  Category*
                </label>
                {loadingCategories ? (
                  <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
                ) : (
                  <>
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
                    {categories.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No categories available. Please create a category first.
                      </p>
                    )}
                  </>
                )}
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
              disabled={loading || categories.length === 0}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⌛</span> Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Item
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}