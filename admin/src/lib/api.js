import axios from 'axios';

// Create an axios instance with base URL and default headers
const isClient = typeof window !== 'undefined';

// API loading state manager (for tracking loading states across the app)
export const apiLoadingState = {
  // Track active requests by endpoint
  activeRequests: {},
  // Event listeners
  listeners: [],
  
  // Start loading for a specific endpoint
  startLoading: function(endpoint) {
    this.activeRequests[endpoint] = true;
    this.notifyListeners();
  },
  
  // End loading for a specific endpoint
  endLoading: function(endpoint) {
    this.activeRequests[endpoint] = false;
    this.notifyListeners();
  },
  
  // Check if a specific endpoint is loading
  isLoading: function(endpoint) {
    return !!this.activeRequests[endpoint];
  },
  
  // Check if any requests are loading
  isAnyLoading: function() {
    return Object.values(this.activeRequests).some(loading => loading);
  },
  
  // Subscribe to changes
  subscribe: function(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  
  // Notify all listeners of a change
  notifyListeners: function() {
    this.listeners.forEach(listener => listener(this.activeRequests));
  }
};

// Helper function to get API URL
const getApiBaseUrl = () => {
  if (isClient) {
    console.log('Current hostname:', window.location.hostname);
    
    // For all environments (local, replit, production)
    // Use Next.js API route that handles the proxying
    // This approach is more reliable across environments
    const apiUrl = '/api';
    console.log('Using API URL:', apiUrl);
    return apiUrl;
  }
  
  // On server-side: use environment variable or default localhost URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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
  const endpoint = 'categories';
  
  try {
    // Start loading
    apiLoadingState.startLoading(endpoint);
    
    const params = activeOnly ? { activeOnly: 'true' } : {};
    const response = await api.get('/categories', { params });
    console.log('Categories API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    return handleApiError(error);
  } finally {
    // End loading regardless of success or failure
    apiLoadingState.endLoading(endpoint);
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

export const toggleCategoryActive = async (id, isActive) => {
  const endpoint = `category-toggle-${id}`;
  try {
    apiLoadingState.startLoading(endpoint);
    const response = await api.put(`/categories/${id}`, { isActive });
    console.log('Toggle category active state response:', response.data);
    return extractData(response.data);
  } catch (error) {
    return handleApiError(error);
  } finally {
    apiLoadingState.endLoading(endpoint);
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
  const endpoint = 'items';
  
  try {
    // Start loading
    apiLoadingState.startLoading(endpoint);
    
    const params = {};
    
    if (options.limit) params.limit = options.limit;
    if (options.skip) params.skip = options.skip;
    if (options.activeOnly !== undefined) params.activeOnly = options.activeOnly;
    
    const response = await api.get('/items', { params });
    console.log('Items API response:', response.data);
    return extractData(response.data);
  } catch (error) {
    return handleApiError(error);
  } finally {
    // End loading regardless of success or failure
    apiLoadingState.endLoading(endpoint);
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
  const endpoint = 'stats';
  
  try {
    // Start loading
    apiLoadingState.startLoading(endpoint);
    
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
  } finally {
    // End loading regardless of success or failure
    apiLoadingState.endLoading(endpoint);
  }
};