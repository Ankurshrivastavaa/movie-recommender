const fetch = require('node-fetch');
const User = require('../models/User');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

const tmdbFetch = async (endpoint, params = {}, retries = 3) => {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', TMDB_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, (i + 1) * 1000));
    }
  }
};

exports.getPersonalized = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let genreIds = user.preferredGenres || [];

    const promises = [];

    if (genreIds.length > 0) {
      promises.push(
        tmdbFetch('/discover/movie', {
          with_genres: genreIds.slice(0, 3).join(','),
          sort_by: 'vote_average.desc',
          'vote_count.gte': 200,
          page: 1
        })
      );
    }

    if (user.favorites.length > 0) {
      const topFav = user.favorites[user.favorites.length - 1];
      promises.push(tmdbFetch(`/movie/${topFav.movieId}/similar`, { page: 1 }));
      promises.push(tmdbFetch(`/movie/${topFav.movieId}/recommendations`, { page: 1 }));
    }

    promises.push(tmdbFetch('/trending/movie/week', { page: 1 }));
    promises.push(tmdbFetch('/movie/top_rated', { page: 1 }));

    const results = await Promise.allSettled(promises);
    const allMovies = [];

    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value.results) {
        allMovies.push(...r.value.results);
      }
    });

    const seen = new Set();
    const favIds = new Set(user.favorites.map(f => f.movieId));
    const unique = allMovies.filter(m => {
      if (seen.has(m.id) || favIds.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    const scored = unique
      .map(m => ({ ...m, score: m.popularity * 0.3 + m.vote_average * 10 * 0.7 }))
      .sort((a, b) => b.score - a.score);

    res.json({ success: true, results: scored.slice(0, 40), total_results: scored.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSimilar = async (req, res) => {
  try {
    const { id } = req.params;
    const [similar, recommendations] = await Promise.allSettled([
      tmdbFetch(`/movie/${id}/similar`),
      tmdbFetch(`/movie/${id}/recommendations`)
    ]);

    const combined = [
      ...(similar.status === 'fulfilled' ? similar.value.results || [] : []),
      ...(recommendations.status === 'fulfilled' ? recommendations.value.results || [] : [])
    ];

    const seen = new Set();
    const unique = combined.filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    res.json({ success: true, results: unique.slice(0, 20) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByGenre = async (req, res) => {
  try {
    const { genre_id, page = 1 } = req.query;
    const data = await tmdbFetch('/discover/movie', {
      with_genres: genre_id,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 300,
      page
    });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};