import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Star, Play, Info } from 'lucide-react';
import { getPosterUrl, formatYear, truncate } from '../../utils/helpers';
import { useMovieActions } from '../../hooks/useMovies';

export default function MovieCard({ movie, index = 0, showRank = false }) {
  const { toggleFavorite, toggleWatchlist, isFavorite, isInWatchlist, loadingId } = useMovieActions();
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  const favActive = isFavorite(movie.id);
  const wlActive = isInWatchlist(movie.id);
  const rating = movie.vote_average?.toFixed(1);

  const ratingColor = rating >= 8 ? 'text-green-400' : rating >= 6 ? 'text-gold-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="movie-card group"
    >
      {/* Rank badge */}
      {showRank && (
        <div className="absolute -top-2 -left-2 z-20 w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-glow-red">
          #{index + 1}
        </div>
      )}

      {/* Poster */}
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={imgError ? `https://via.placeholder.com/500x750/0d1224/ff3932?text=${encodeURIComponent(movie.title || 'Movie')}` : getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(movie); }}
            disabled={loadingId === `fav-${movie.id}`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm border transition-all
              ${favActive ? 'bg-red-500/80 border-red-400 text-white' : 'bg-dark-900/70 border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/50'}`}
            title={favActive ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={14} fill={favActive ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleWatchlist(movie); }}
            disabled={loadingId === `wl-${movie.id}`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm border transition-all
              ${wlActive ? 'bg-brand-600/80 border-brand-400 text-white' : 'bg-dark-900/70 border-white/10 text-white/60 hover:text-brand-400 hover:border-brand-400/50'}`}
            title={wlActive ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Bookmark size={14} fill={wlActive ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 left-3">
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-dark-900/80 backdrop-blur-sm ${ratingColor}`}>
            <Star size={10} fill="currentColor" />
            {rating}
          </div>
        </div>

        {/* Play/Info overlay */}
        <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 p-3">
          <Link to={`/movie/${movie.id}`}
            className="flex items-center justify-center gap-2 w-full py-2 bg-brand-600/90 backdrop-blur-sm rounded-xl text-white text-sm font-medium hover:bg-brand-500 transition-colors">
            <Info size={14} />
            View Details
          </Link>
        </div>
      </div>

      {/* Card info */}
      <div className="p-3">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="text-sm font-semibold text-white truncate hover:text-brand-400 transition-colors leading-tight">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-white/35">{formatYear(movie.release_date)}</span>
          {movie.genre_ids?.length > 0 && (
            <span className="text-xs text-white/30 truncate max-w-[100px] text-right">
              {/* Genre would need mapping */}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
