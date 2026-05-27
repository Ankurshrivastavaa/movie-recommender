import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Film, Trash2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { getPosterUrl, formatYear } from '../utils/helpers';
import { useMovieActions } from '../hooks/useMovies';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { toggleFavorite } = useMovieActions();
  const [favorites, setFavorites] = useState(user?.favorites || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getFavorites()
      .then(({ data }) => setFavorites(data.favorites?.slice().reverse() || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (movie) => {
    await toggleFavorite({ id: movie.movieId, ...movie });
    setFavorites(prev => prev.filter(f => f.movieId !== movie.movieId));
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Heart size={26} className="text-red-400" fill="currentColor" />
          <h1 className="font-display text-3xl font-bold text-white">Favorites</h1>
        </div>
        <p className="text-white/40 text-sm">{favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved</p>
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
      ) : favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
          <Heart size={56} className="text-white/10 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-white/40 text-sm mb-6 max-w-sm">Start adding movies you love to your favorites collection</p>
          <Link to="/movies" className="btn-primary">
            <Film size={16} /> Browse Movies
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites.map((movie, i) => (
            <motion.div
              key={movie.movieId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="group relative rounded-2xl overflow-hidden bg-dark-700 hover:-translate-y-2 hover:shadow-card transition-all duration-300"
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
                  {movie.vote_average && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-dark-900/80 text-gold-400">
                      <Star size={10} fill="currentColor" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
              </Link>

              {/* Remove button */}
              <button
                onClick={() => handleRemove(movie)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                title="Remove from favorites"
              >
                <Trash2 size={13} className="text-white" />
              </button>

              <div className="p-3">
                <Link to={`/movie/${movie.movieId}`}>
                  <p className="text-white text-sm font-medium truncate hover:text-brand-400 transition-colors">{movie.title}</p>
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
