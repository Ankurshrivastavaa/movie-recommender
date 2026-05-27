import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBackdropUrl, formatYear, formatRuntime, truncate } from '../../utils/helpers';

export default function HeroBanner({ movies = [] }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrent(p => (p + 1) % Math.min(movies.length, 6));
    }, 6000);
    return () => clearInterval(interval);
  }, [autoPlay, movies.length]);

  if (!movies.length) return <div className="h-[75vh] bg-dark-700 animate-pulse rounded-none" />;

  const featured = movies[current];
  const bgUrl = getBackdropUrl(featured?.backdrop_path);

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}>

      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={bgUrl} alt={featured?.title}
            className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/20" />
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute inset-0 flex items-center"
        >
          <div className="px-6 md:px-10 max-w-2xl">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 bg-brand-600/10 border border-brand-500/20 px-3 py-1 rounded-full">
                🔥 Featured
              </span>
              {featured?.adult === false && (
                <span className="text-xs font-medium text-white/40 border border-white/10 px-2 py-1 rounded-full">PG-13</span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight text-shadow mb-3">
              {featured?.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-gold-400">
                <Star size={14} fill="currentColor" />
                <span className="font-bold text-sm">{featured?.vote_average?.toFixed(1)}</span>
                <span className="text-white/30 text-xs">({featured?.vote_count?.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Calendar size={13} />
                {formatYear(featured?.release_date)}
              </div>
              {featured?.runtime && (
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Clock size={13} />
                  {formatRuntime(featured.runtime)}
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
              {truncate(featured?.overview, 160)}
            </p>

            {/* Genres */}
            {featured?.genres && (
              <div className="flex flex-wrap gap-2 mb-6">
                {featured.genres.slice(0, 3).map(g => (
                  <span key={g.id} className="genre-pill">{g.name}</span>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link to={`/movie/${featured?.id}`} className="btn-primary">
                <Play size={16} fill="white" />
                Watch Now
              </Link>
              <Link to={`/movie/${featured?.id}`} className="btn-ghost">
                <Info size={16} />
                More Info
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <button onClick={() => setCurrent(p => (p - 1 + movies.length) % movies.length)}
          className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setCurrent(p => (p + 1) % movies.length)}
          className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-6 md:left-10 flex items-center gap-2">
        {movies.slice(0, 6).map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-brand-500' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
