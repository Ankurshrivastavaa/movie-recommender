const express = require('express');
const router = express.Router();
const {
  getTrending, getPopular, getTopRated, getNowPlaying, getUpcoming,
  getMovieDetails, searchMovies, getByGenre, getGenres, getDiscover
} = require('../controllers/movieController');

router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/top-rated', getTopRated);
router.get('/now-playing', getNowPlaying);
router.get('/upcoming', getUpcoming);
router.get('/search', searchMovies);
router.get('/genres', getGenres);
router.get('/discover', getDiscover);
router.get('/by-genre', getByGenre);
router.get('/:id', getMovieDetails);

module.exports = router;
