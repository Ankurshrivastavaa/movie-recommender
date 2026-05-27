import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Film, Trash2, Star, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { getPosterUrl, formatYear } from '../utils/helpers';
import { useMovieActions } from '../hooks/useMovies';

export default function WatchlistPage() {
  const { user } = useAuth();
  const { toggleWatchlist } = useMovieActions();
  const [watchlist, setWatchlist] = useState(user?.watchlist || []);
  const [loading, setLoading] = useState(true);
  const [watched, setWatched] = useState(new Set());

  useEffect(() => {
    userAPI.getWatchlist()
      .then(({ data }) => setWatchlist(data.watchlist?.slice().reverse() || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (movie) => {
    await toggleWatchlist({ id: movie.movieId, ...movie });
    setWatchlist(prev => prev.filter(w => w.movieId !== movie.movieId));
  };

  const toggleWatched = (id) => {
    setWatched(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Bookmark size={26} className="text-brand-400" fill="currentColor" />
          <h1 className="font-display text-3xl font-bold text-white">Watchlist</h1>
        </div>
        <p className="text-white/40 text-sm">{watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} to watch</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-dark-700 animate-pulse">
              <div className="aspect-[2/3] skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-3 skeleton rounded w-4/5" />
                <div className="h-2 skeleton rounded w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : watchlist.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
          <Bookmark size={56} className="text-white/10 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
          <p className="text-white/40 text-sm mb-6 max-w-sm">Save movies you want to watch later here</p>
          <Link to="/movies" className="btn-primary">
            <Film size={16} /> Browse Movies
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {watchlist.map((movie, i) => (
            <motion.div
              key={movie.movieId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`group relative rounded-2xl overflow-hidden bg-dark-700 hover:-translate-y-2 transition-all duration-300 ${watched.has(movie.movieId) ? 'opacity-60' : 'hover:shadow-card'}`}
            >
              <Link to={`/movie/${movie.movieId}`}>
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = `https://via.placeholder.com/500x750/0d1224/ff3932?text=${encodeURIComponent(movie.title)}`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Watched overlay */}
                  {watched.has(movie.movieId) && (
                    <div className="absolute inset-0 bg-dark-900/60 flex items-center justify-center">
                      <div className="w-12 h-12 bg-green-500/80 rounded-full flex items-center justify-center">
                        <Check size={20} className="text-white" />
                      </div>
                    </div>
                  )}

                  {movie.vote_average && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-dark-900/80 text-gold-400">
                      <Star size={10} fill="currentColor" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
              </Link>

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleWatched(movie.movieId)}
                  className={`w-8 h-8 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all ${watched.has(movie.movieId) ? 'bg-green-500/80 hover:bg-green-500' : 'bg-dark-900/70 hover:bg-green-500/60'}`}
                  title="Mark as watched"
                >
                  <Check size={13} className="text-white" />
                </button>
                <button
                  onClick={() => handleRemove(movie)}
                  className="w-8 h-8 bg-red-500/70 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-red-500 transition-all"
                  title="Remove from watchlist"
                >
                  <Trash2 size={13} className="text-white" />
                </button>
              </div>

              <div className="p-3">
                <Link to={`/movie/${movie.movieId}`}>
                  <p className={`text-sm font-medium truncate hover:text-brand-400 transition-colors ${watched.has(movie.movieId) ? 'text-white/40 line-through' : 'text-white'}`}>
                    {movie.title}
                  </p>
                </Link>
                <p className="text-white/35 text-xs mt-0.5">{formatYear(movie.release_date)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
