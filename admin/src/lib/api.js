import axios from 'axios';

// API base URL - when running locally it will proxy through Next.js to the NestJS server
const API_URL = '/api';

// Categories API
export const fetchCategories = async (activeOnly = false) => {
  try {
    const response = await axios.get(`${API_URL}/categories?activeOnly=${activeOnly}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchCategory = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

export const fetchCategoryByUniqId = async (uniqId) => {
  try {
    const response = await axios.get(`${API_URL}/categories/uniqId/${uniqId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category by uniqId ${uniqId}:`, error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};

// Items API
export const fetchItems = async (options = {}) => {
  try {
    const { limit, skip, activeOnly } = options;
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit);
    if (skip) params.append('skip', skip);
    if (activeOnly !== undefined) params.append('activeOnly', activeOnly);
    
    const queryString = params.toString();
    const url = `${API_URL}/items${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const fetchItem = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw error;
  }
};

export const fetchItemsByCategory = async (categoryUniqId, activeOnly = false) => {
  try {
    const response = await axios.get(
      `${API_URL}/items/category/${categoryUniqId}?activeOnly=${activeOnly}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching items by category ${categoryUniqId}:`, error);
    throw error;
  }
};

export const searchItemsByName = async (nameQuery, options = {}) => {
  try {
    const { limit, skip, activeOnly } = options;
    const params = new URLSearchParams({ nameQuery });
    
    if (limit) params.append('limit', limit);
    if (skip) params.append('skip', skip);
    if (activeOnly !== undefined) params.append('activeOnly', activeOnly);
    
    const queryString = params.toString();
    const url = `${API_URL}/items/search/name?${queryString}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error searching items by name ${nameQuery}:`, error);
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await axios.post(`${API_URL}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const updateItem = async (id, itemData) => {
  try {
    const response = await axios.put(`${API_URL}/items/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${id}:`, error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
    throw error;
  }
};