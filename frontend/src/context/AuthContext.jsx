import { useState, useEffect, createContext, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import * as jwt_decode from 'jwt-decode'
import PropTypes from 'prop-types'

const AuthContext = createContext()

// Configuration Axios globale
axios.defaults.baseURL = 'http://127.0.0.1:8000'

// Fonction pour rafraîchir le token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
            throw new Error('No refresh token available')
        }

        // Vérifier si le token n'est pas déjà en cours de rafraîchissement
        if (window.refreshingToken) {
            return window.refreshingToken
        }

        window.refreshingToken = axios.post('/token/refresh/', {
            "refresh": refreshToken
        }).then(response => {
            if (!response.data || !response.data.access) {
                throw new Error('Invalid response format')
            }
            const { access } = response.data
            localStorage.setItem('accessToken', access)
            return access
        }).finally(() => {
            window.refreshingToken = null
        })

        return await window.refreshingToken
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error)
        throw error
    }
}

// Intercepteur pour ajouter le token aux requêtes
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

// Intercepteur pour gérer les erreurs 401 et rafraîchir le token
/* axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Éviter les boucles infinies
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/token/refresh/')) {
            originalRequest._retry = true
            
            try {
                const newAccessToken = await refreshAccessToken()
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return axios(originalRequest)
            } catch (refreshError) {
                // Si le rafraîchissement échoue, déconnecter l'utilisateur
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/connexion'
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
) */

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isProtectedRoute = window.location.pathname.startsWith('/dashboard');

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/token/refresh/')) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Ne rediriger que si on est sur une route protégée
        if (isProtectedRoute) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/connexion';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    // Fonction pour décoder le token JWT
    const decodeToken = useCallback((token) => {
        try {
            if (!token) return null
            return jwt_decode.jwtDecode(token)
        } catch (error) {
            console.error('Erreur de décodage du token:', error)
            return null
        }
    }, [])

    // Vérifier si le token est expiré
    const isTokenExpired = useCallback((token) => {
        if (!token) return true
        const decoded = decodeToken(token)
        if (!decoded) return true
        return decoded.exp * 1000 < Date.now()
    }, [decodeToken])

    // Vérifier si le refresh token est expiré
    const isRefreshTokenExpired = useCallback(() => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) return true
        return isTokenExpired(refreshToken)
    }, [isTokenExpired])

    // Récupérer l'utilisateur connecté
    /* const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token || isTokenExpired(token)) {
                if (isRefreshTokenExpired()) {
                    setUser(null)
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    navigate('/connexion')
                    return
                }
                await refreshAccessToken()
            }

            const response = await axios.get('/api/me/')
            setUser(response.data)
        } catch (error) {
            console.error("Erreur de récupération de l'utilisateur:", error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [isTokenExpired, isRefreshTokenExpired ,  navigate]) */

    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token || isTokenExpired(token)) {
            if (isRefreshTokenExpired()) {
                setUser(null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // Ne rediriger que si on est sur une route protégée
                if (window.location.pathname.startsWith('/dashboard')) {
                navigate('/');
                }
                return;
            }
            await refreshAccessToken();
            }

            const response = await axios.get('/api/me/');
            setUser(response.data);
        } catch (error) {
            console.log(error)
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [isTokenExpired, isRefreshTokenExpired, navigate]);

    // Connexion utilisateur
    const loginUser = async (credentials) => {
        try {
            setError(null)
            const response = await axios.post('/connexion/', credentials)
            
            if (!response.data || !response.data.tokens) {
                throw new Error('Format de réponse invalide')
            }

            const { access, refresh } = response.data.tokens
            if (!access || !refresh) {
                throw new Error('Tokens manquants dans la réponse')
            }

            localStorage.setItem('accessToken', access)
            localStorage.setItem('refreshToken', refresh)
            await fetchUser()
            navigate('/dashboard')
            return { success: true }
        } catch (error) {
            console.error('Erreur de connexion:', error)
            const message = error.response?.data?.error || error.message || 'Erreur de connexion'
            setError(message)
            return { success: false, error: message }
        }
    }

    // Déconnexion utilisateur
    const logoutUser = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
                await axios.post('/deconnexion/', { refresh: refreshToken })
            }
        } catch (error) {
            console.error('Erreur de déconnexion:', error)
        } finally {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            setUser(null)
            navigate('/')
        }
    }

    // Vérifier l'authentification au chargement et toutes les 5 minutes
    useEffect(() => {
        fetchUser()
        const interval = setInterval(fetchUser, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [fetchUser])

    const contextData = {
        user,
        loginUser,
        logoutUser,
        loading,
        error,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default AuthContext