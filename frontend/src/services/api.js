import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cineai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cineai_token');
      localStorage.removeItem('cineai_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ─── Movies ──────────────────────────────────────────────────────────────────
export const moviesAPI = {
  getTrending: (params) => api.get('/movies/trending', { params }),
  getPopular: (params) => api.get('/movies/popular', { params }),
  getTopRated: (params) => api.get('/movies/top-rated', { params }),
  getNowPlaying: (params) => api.get('/movies/now-playing', { params }),
  getUpcoming: (params) => api.get('/movies/upcoming', { params }),
  getDetails: (id) => api.get(`/movies/${id}`),
  search: (params) => api.get('/movies/search', { params }),
  getByGenre: (params) => api.get('/movies/by-genre', { params }),
  getGenres: () => api.get('/movies/genres'),
  discover: (params) => api.get('/movies/discover', { params }),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const userAPI = {
  toggleFavorite: (data) => api.post('/users/favorites', data),
  getFavorites: () => api.get('/users/favorites'),
  toggleWatchlist: (data) => api.post('/users/watchlist', data),
  getWatchlist: () => api.get('/users/watchlist'),
  addSearchHistory: (query) => api.post('/users/search-history', { query }),
  getSearchHistory: () => api.get('/users/search-history'),
  rateMovie: (data) => api.post('/users/rate', data),
  updateGenres: (genres) => api.put('/users/genres', { genres }),
  getDashboard: () => api.get('/users/dashboard'),
};

// ─── Recommendations ─────────────────────────────────────────────────────────
export const recommendAPI = {
  getPersonalized: () => api.get('/recommendations/personalized'),
  getSimilar: (id) => api.get(`/recommendations/similar/${id}`),
  getByGenre: (params) => api.get('/recommendations/by-genre', { params }),
};

export default api;
