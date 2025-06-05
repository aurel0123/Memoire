import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configuration d'axios pour inclure les credentials
axios.defaults.withCredentials = true;

export const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/utilisateurs/`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Ajouter un nouvel utilisateur
  addUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users/add/`, userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/update/`, userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}/delete/`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approuver un utilisateur
  approveUser: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/approuver/${userId}/`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 