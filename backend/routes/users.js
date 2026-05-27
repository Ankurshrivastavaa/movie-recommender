const express = require('express');
const router = express.Router();
const {
  toggleFavorite, toggleWatchlist, getFavorites, getWatchlist,
  addSearchHistory, getSearchHistory, rateMovie, updateGenres, getDashboardStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/favorites', getFavorites);
router.post('/favorites', toggleFavorite);
router.get('/watchlist', getWatchlist);
router.post('/watchlist', toggleWatchlist);
router.get('/search-history', getSearchHistory);
router.post('/search-history', addSearchHistory);
router.post('/rate', rateMovie);
router.put('/genres', updateGenres);
router.get('/dashboard', getDashboardStats);

module.exports = router;
