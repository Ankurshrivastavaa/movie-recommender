const fetch = require('node-fetch');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

// Fetch with timeout + retry
const tmdbFetch = async (endpoint, params = {}, retries = 3) => {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', TMDB_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error(`TMDB error: ${res.status} ${res.statusText}`);
      return await res.json();

    } catch (err) {
      console.error(`TMDB attempt ${i + 1} failed for ${endpoint}:`, err.message);
      if (i === retries - 1) throw err;
      // Wait before retry: 1s, 2s, 3s
      await new Promise(r => setTimeout(r, (i + 1) * 1000));
    }
  }
};

exports.getTrending = async (req, res) => {
  try {
    const { time_window = 'week', page = 1 } = req.query;
    const data = await tmdbFetch(`/trending/movie/${time_window}`, { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPopular = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/movie/popular', { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopRated = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/movie/top_rated', { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNowPlaying = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/movie/now_playing', { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUpcoming = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbFetch('/movie/upcoming', { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch details first, then others in parallel
    const details = await tmdbFetch(`/movie/${id}`);

    const [credits, videos, similar, reviews] = await Promise.allSettled([
      tmdbFetch(`/movie/${id}/credits`),
      tmdbFetch(`/movie/${id}/videos`),
      tmdbFetch(`/movie/${id}/similar`),
      tmdbFetch(`/movie/${id}/reviews`)
    ]);

    res.json({
      success: true,
      movie: details,
      credits: credits.status === 'fulfilled' ? credits.value : { cast: [], crew: [] },
      videos: videos.status === 'fulfilled' ? videos.value.results : [],
      similar: similar.status === 'fulfilled' ? similar.value.results : [],
      reviews: reviews.status === 'fulfilled' ? reviews.value.results : []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ error: 'Search query required.' });
    const data = await tmdbFetch('/search/movie', { query, page, include_adult: false });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByGenre = async (req, res) => {
  try {
    const { genre_ids, page = 1, sort_by = 'popularity.desc' } = req.query;
    const data = await tmdbFetch('/discover/movie', {
      with_genres: genre_ids,
      page,
      sort_by,
      'vote_count.gte': 100
    });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const data = await tmdbFetch('/genre/movie/list');
    res.json({ success: true, genres: data.genres });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDiscover = async (req, res) => {
  try {
    const {
      page = 1,
      sort_by = 'popularity.desc',
      with_genres,
      year,
      'vote_average.gte': minRating
    } = req.query;

    const params = { page, sort_by, 'vote_count.gte': 50 };
    if (with_genres) params.with_genres = with_genres;
    if (year) params.primary_release_year = year;
    if (minRating) params['vote_average.gte'] = minRating;

    const data = await tmdbFetch('/discover/movie', params);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};