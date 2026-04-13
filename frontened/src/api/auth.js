import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Login failed');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/signup`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Signup failed');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};