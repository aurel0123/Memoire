import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
});

// Intercepteur pour ajouter le token d'authentification
axios.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
          config.headers.Authorization = `Bearer ${token}`
      }
      return config
  },
  (error) => {
      return Promise.reject(error)
  }
)

// Fonctions de service
export const services = {
  // GET
  get: async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // POST
  post: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // PUT
  put: async (endpoint, data) => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // DELETE
  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Gestion des erreurs
const handleError = (error) => {
  if (error.response) {
    // Erreur du serveur
    console.error('Erreur serveur:', error.response.data);
    return error.response.data;
  } else if (error.request) {
    // Erreur de requête
    console.error('Erreur de requête:', error.request);
    return { message: 'Erreur de connexion au serveur' };
  } else {
    // Erreur de configuration
    console.error('Erreur:', error.message);
    return { message: 'Une erreur est survenue' };
  }
}; 