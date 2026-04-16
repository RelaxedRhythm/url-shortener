import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, credentials, { withCredentials: true });
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
    const response = await axios.post(`${API_BASE_URL}/user/signup`, userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Signup failed');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/me`, { withCredentials: true });
    return { isLoggedIn: true, user: response.data.user };
  } catch (error) {
    return { isLoggedIn: false };
  }
};