import { useState, useEffect, useCallback } from 'react';
import { moviesAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Hook for fetching movies list
export const useMovies = (fetcher, params = {}, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher({ ...params, page: p });
      const results = res.data.results || [];
      setData(p === 1 ? results : prev => [...prev, ...results]);
      setTotalPages(res.data.total_pages || 1);
      setPage(p);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [...deps, page]);

  useEffect(() => { fetch(1); }, [...deps]);

  const loadMore = () => { if (page < totalPages) fetch(page + 1); };

  return { data, loading, error, page, totalPages, loadMore, refetch: () => fetch(1) };
};

// Hook for single movie details
export const useMovieDetails = (id) => {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    moviesAPI.getDetails(id)
      .then(({ data }) => {
        setMovie(data.movie);
        setCredits(data.credits);
        setVideos(data.videos || []);
        setSimilar(data.similar || []);
        setReviews(data.reviews || []);
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch movie'))
      .finally(() => setLoading(false));
  }, [id]);

  return { movie, credits, videos, similar, reviews, loading, error };
};

// Hook for favorite/watchlist toggling
export const useMovieActions = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const [loadingId, setLoadingId] = useState(null);

  const toggleFavorite = async (movie) => {
    if (!isAuthenticated) { toast.error('Please login to add favorites'); return; }
    setLoadingId(`fav-${movie.id}`);
    try {
      const { data } = await userAPI.toggleFavorite({
        movieId: movie.id, title: movie.title,
        poster_path: movie.poster_path, vote_average: movie.vote_average,
        release_date: movie.release_date
      });
      updateUser({ favorites: data.favorites });
      toast.success(data.action === 'added' ? '❤️ Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to update favorites');
    } finally {
      setLoadingId(null);
    }
  };

  const toggleWatchlist = async (movie) => {
    if (!isAuthenticated) { toast.error('Please login to add to watchlist'); return; }
    setLoadingId(`wl-${movie.id}`);
    try {
      const { data } = await userAPI.toggleWatchlist({
        movieId: movie.id, title: movie.title,
        poster_path: movie.poster_path, vote_average: movie.vote_average,
        release_date: movie.release_date
      });
      updateUser({ watchlist: data.watchlist });
      toast.success(data.action === 'added' ? '🎬 Added to watchlist' : 'Removed from watchlist');
    } catch {
      toast.error('Failed to update watchlist');
    } finally {
      setLoadingId(null);
    }
  };

  const isFavorite = (id) => user?.favorites?.some(f => f.movieId === Number(id));
  const isInWatchlist = (id) => user?.watchlist?.some(w => w.movieId === Number(id));

  return { toggleFavorite, toggleWatchlist, isFavorite, isInWatchlist, loadingId };
};

// Search hook with debounce
export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await moviesAPI.search({ query });
        setResults(data.results || []);
      } catch {
        setError('Search failed');
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, results, loading, error };
};
