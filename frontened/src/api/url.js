import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const generateShortUrl = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/url`, { url }, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to generate short URL');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};

export const generateCustomUrl = async (url, customId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/url/customUrl`, 
      { url, customId }, { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to generate custom URL');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};

export const getAnalytics = async (shortId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/url/analytics/${shortId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch analytics');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};
