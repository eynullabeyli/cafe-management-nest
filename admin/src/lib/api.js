import axios from 'axios';

// Create an axios instance with base URL and default headers
const isClient = typeof window !== 'undefined';

// On the client-side, we'll use the relative URL to let Next.js handle rewrites
// On the server-side, we'll use the absolute URL
const api = axios.create({
  baseURL: isClient ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler helper
const handleApiError = (error) => {
  console.error('API Error:', error.response || error);
  
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error('An unexpected error occurred');
  }
};

// Categories API functions
export const fetchCategories = async (activeOnly = false) => {
  try {
    const params = activeOnly ? { activeOnly: 'true' } : {};
    const response = await api.get('/categories', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCategory = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCategoryByUniqId = async (uniqId) => {
  try {
    const response = await api.get(`/categories/uniqId/${uniqId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
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
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchItem = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchItemsByCategory = async (categoryUniqId, activeOnly = false) => {
  try {
    const params = activeOnly ? { activeOnly: 'true' } : {};
    const response = await api.get(`/items/category/${categoryUniqId}`, { params });
    return response.data;
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
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await api.post('/items', itemData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateItem = async (id, itemData) => {
  try {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch stats
export const fetchStats = async () => {
  // This is a placeholder function for fetching dashboard stats
  // In a real application, this would call a dedicated endpoint
  try {
    const [categories, items] = await Promise.all([
      fetchCategories(),
      fetchItems()
    ]);
    
    const activeCategories = categories.filter(cat => cat.isActive);
    const activeItems = items.filter(item => item.isActive);
    const newItems = items.filter(item => item.isNew);
    
    return {
      totalCategories: categories.length,
      activeCategories: activeCategories.length,
      totalItems: items.length,
      activeItems: activeItems.length,
      newItems: newItems.length
    };
  } catch (error) {
    handleApiError(error);
  }
};