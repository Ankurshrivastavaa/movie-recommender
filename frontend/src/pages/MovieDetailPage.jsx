import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Calendar, Clock, Globe, DollarSign, Heart, Bookmark,
  Play, ArrowLeft, Award, Users, ChevronRight
} from 'lucide-react';
import { useMovieDetails } from '../hooks/useMovies';
import { useMovieActions } from '../hooks/useMovies';
import {
  getBackdropUrl, getPosterUrl, getProfileUrl, formatDate,
  formatRuntime, formatCurrency, getRatingBg, truncate
} from '../utils/helpers';
import MovieCarousel from '../components/movie/MovieCarousel';

export default function MovieDetailPage() {
  const { id } = useParams();
  const { movie, credits, videos, similar, reviews, loading, error } = useMovieDetails(id);
  const { toggleFavorite, toggleWatchlist, isFavorite, isInWatchlist } = useMovieActions();

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-[50vh] bg-dark-700 skeleton" />
      <div className="px-6 space-y-4">
        <div className="h-8 bg-dark-700 skeleton rounded-xl w-1/2" />
        <div className="h-4 bg-dark-700 skeleton rounded-xl w-full" />
        <div className="h-4 bg-dark-700 skeleton rounded-xl w-3/4" />
      </div>
    </div>
  );

  if (error || !movie) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-6xl mb-4">🎬</div>
      <h2 className="text-xl font-bold text-white mb-2">Movie not found</h2>
      <p className="text-white/40 mb-6">{error}</p>
      <Link to="/" className="btn-primary">← Back to Home</Link>
    </div>
  );

  const trailer = videos?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos?.[0];
  const director = credits?.crew?.find(c => c.job === 'Director');
  const cast = credits?.cast?.slice(0, 12) || [];
  const rating = movie.vote_average?.toFixed(1);
  const ratingClass = getRatingBg(movie.vote_average);

  const favActive = isFavorite(movie.id);
  const wlActive = isInWatchlist(movie.id);

  return (
    <div className="animate-fade-in">
      {/* Backdrop */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src={getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/30" />

        {/* Back button */}
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 glass rounded-xl px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Play trailer button */}
        {trailer && (
          <a
            href={`https://www.youtube.com/watch?v=${trailer.key}`}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 bg-brand-600/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glow-red hover:bg-brand-500 transition-all hover:scale-110 group">
              <Play size={28} className="text-white ml-1" fill="white" />
            </div>
          </a>
        )}
      </div>

      {/* Main content */}
      <div className="px-4 md:px-8 -mt-20 relative z-10">
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-40 md:w-56 rounded-2xl shadow-card border border-white/10"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 pt-20 md:pt-0"
          >
            {/* Title */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1 text-shadow">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-white/40 text-sm italic">"{movie.tagline}"</p>
                )}
              </div>
              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border
                    ${favActive ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/40'}`}
                >
                  <Heart size={15} fill={favActive ? 'currentColor' : 'none'} />
                  {favActive ? 'Favorited' : 'Favorite'}
                </button>
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border
                    ${wlActive ? 'bg-brand-600/20 border-brand-500/40 text-brand-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-brand-400 hover:border-brand-400/40'}`}
                >
                  <Bookmark size={15} fill={wlActive ? 'currentColor' : 'none'} />
                  {wlActive ? 'In Watchlist' : 'Watchlist'}
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-4 mb-4">
              <div className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl border ${ratingClass}`}>
                <Star size={13} fill="currentColor" />
                {rating} / 10
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Calendar size={14} />
                {formatDate(movie.release_date)}
              </div>
              {movie.runtime && (
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Clock size={14} />
                  {formatRuntime(movie.runtime)}
                </div>
              )}
              {movie.original_language && (
                <div className="flex items-center gap-1.5 text-white/50 text-sm uppercase">
                  <Globe size={14} />
                  {movie.original_language}
                </div>
              )}
              <span className="text-white/25 text-xs">{movie.vote_count?.toLocaleString()} votes</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map(g => (
                <span key={g.id} className="genre-pill active">{g.name}</span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-white/65 leading-relaxed mb-5 max-w-2xl">{movie.overview}</p>

            {/* Director */}
            {director && (
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="text-white/30">Director:</span>
                <span className="text-white/80 font-medium">{director.name}</span>
              </div>
            )}

            {/* Financial */}
            <div className="flex flex-wrap gap-6 mt-4">
              {movie.budget > 0 && (
                <div>
                  <p className="text-white/30 text-xs mb-0.5">Budget</p>
                  <p className="text-white/70 text-sm font-medium">{formatCurrency(movie.budget)}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-white/30 text-xs mb-0.5">Revenue</p>
                  <p className="text-green-400 text-sm font-medium">{formatCurrency(movie.revenue)}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="section-title mb-5 flex items-center gap-2">
              <Users size={22} className="text-brand-400" /> Cast
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {cast.map(person => (
                <div key={person.id} className="flex-shrink-0 w-28 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-white/10">
                    <img
                      src={getProfileUrl(person.profile_path)}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0d1224&color=ff3932&size=80`;
                      }}
                    />
                  </div>
                  <p className="text-white text-xs font-medium leading-tight">{person.name}</p>
                  <p className="text-white/30 text-xs mt-0.5 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h2 className="section-title mb-5">Reviews</h2>
            <div className="space-y-4 max-w-3xl">
              {reviews.slice(0, 3).map(review => (
                <div key={review.id} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-brand-600/20 rounded-xl flex items-center justify-center text-brand-400 font-bold text-sm">
                      {review.author?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{review.author}</p>
                      {review.author_details?.rating && (
                        <div className="flex items-center gap-1 text-gold-400 text-xs">
                          <Star size={10} fill="currentColor" />
                          {review.author_details.rating}/10
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {truncate(review.content, 300)}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="mt-12 mb-8">
            <MovieCarousel
              movies={similar}
              title="Similar Movies"
              subtitle="You might also like"
              icon="🎯"
            />
          </div>
        )}
      </div>
    </div>
  );
}
