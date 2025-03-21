import axios from 'axios';

// Create an axios instance with base URL and default headers
const isClient = typeof window !== 'undefined';

// Helper function to get API URL
const getApiBaseUrl = () => {
  // In Replit environment, we can construct the appropriate URL
  if (isClient && window.location.hostname.includes('.replit.dev')) {
    // Extract the Replit subdomain
    const urlParts = window.location.hostname.split('.');
    // Replace the port (3000) with the NestJS port (5000)
    return `https://${urlParts[0]}-5000.${urlParts.slice(1).join('.')}/api`;
  }
  
  // Default cases:
  // On client-side: use relative URL to let Next.js handle rewrites
  // On server-side: use environment variable or default localhost URL
  return isClient 
    ? '/api' 
    : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api');
};

// Create the Axios instance
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  // Add this to allow access to absolute URLs if needed in Replit
  allowAbsoluteUrls: true,
});

// Error handler helper
const handleApiError = (error) => {
  console.error('API Error:', error.response || error);
  
  // Return null instead of throwing, let the component handle the display
  if (error.response && error.response.data && error.response.data.message) {
    console.error('API Error Message:', error.response.data.message);
    return null;
  } else if (error.message) {
    console.error('Error Message:', error.message);
    return null;
  } else {
    console.error('Unexpected API error occurred');
    return null;
  }
};

// Extract data from response wrapper
const extractData = (response) => {
  // Check if data is in the expected format with a data property
  if (response && response.data !== undefined) {
    return response.data;
  }
  // If not in the expected format, return the whole response
  return response;
};

// Categories API functions
export const fetchCategories = async (activeOnly = false) => {
  try {
    const params = activeOnly ? { activeOnly: 'true' } : {};
    const response = await api.get('/categories', { params });
    console.log('Categories API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCategory = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    console.log('Category API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCategoryByUniqId = async (uniqId) => {
  try {
    const response = await api.get(`/categories/uniqId/${uniqId}`);
    console.log('Category by UniqId API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    console.log('Create Category API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    console.log('Update Category API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    console.log('Delete Category API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

// Items API functions
export const fetchItems = async (options = {}) => {
  try {
    const params = {};
    
    if (options.limit) params.limit = options.limit;
    if (options.skip) params.skip = options.skip;
    if (options.activeOnly !== undefined) params.activeOnly = options.activeOnly;
    
    const response = await api.get('/items', { params });
    console.log('Items API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchItem = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    console.log('Item API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchItemsByCategory = async (categoryUniqId, activeOnly = false) => {
  try {
    const params = activeOnly ? { activeOnly: 'true' } : {};
    const response = await api.get(`/items/category/${categoryUniqId}`, { params });
    console.log('Items by category API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const searchItemsByName = async (nameQuery, options = {}) => {
  try {
    const params = { nameQuery };
    
    if (options.limit) params.limit = options.limit;
    if (options.skip) params.skip = options.skip;
    if (options.activeOnly !== undefined) params.activeOnly = options.activeOnly;
    
    const response = await api.get(`/items/search/name`, { params });
    console.log('Search items API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await api.post('/items', itemData);
    console.log('Create item API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const updateItem = async (id, itemData) => {
  try {
    const response = await api.put(`/items/${id}`, itemData);
    console.log('Update item API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    console.log('Delete item API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch stats
export const fetchStats = async () => {
  // This is a placeholder function for fetching dashboard stats
  // In a real application, this would call a dedicated endpoint
  try {
    // Get categories and items via our fetch functions which now correctly extract data
    const [categories, items] = await Promise.all([
      fetchCategories().catch(() => []),
      fetchItems().catch(() => [])
    ]);
    
    console.log('Stats calculation:');
    console.log('- Categories:', categories);
    console.log('- Items:', items);
    
    // Ensure we have arrays, even if API returns unexpected data
    const categoriesArray = Array.isArray(categories) ? categories : [];
    const itemsArray = Array.isArray(items) ? items : [];
    
    // Safely filter with null checks
    const activeCategories = categoriesArray.filter(cat => cat && cat.isActive);
    const activeItems = itemsArray.filter(item => item && item.isActive);
    const newItems = itemsArray.filter(item => item && item.isNew);
    
    const stats = {
      totalCategories: categoriesArray.length,
      activeCategories: activeCategories.length,
      totalItems: itemsArray.length,
      activeItems: activeItems.length,
      newItems: newItems.length
    };
    
    console.log('Calculated stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default empty stats instead of throwing
    return {
      totalCategories: 0,
      activeCategories: 0,
      totalItems: 0,
      activeItems: 0,
      newItems: 0
    };
  }
};