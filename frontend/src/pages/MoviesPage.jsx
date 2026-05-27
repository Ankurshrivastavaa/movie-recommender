import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Film } from 'lucide-react';
import { moviesAPI } from '../services/api';
import MovieGrid from '../components/movie/MovieGrid';
import GenreFilter from '../components/common/GenreFilter';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'revenue.desc', label: 'Box Office' },
];

const TABS = [
  { key: 'trending', label: '🔥 Trending' },
  { key: 'popular', label: '📈 Popular' },
  { key: 'top_rated', label: '⭐ Top Rated' },
  { key: 'now_playing', label: '🎬 Now Playing' },
  { key: 'upcoming', label: '🚀 Upcoming' },
  { key: 'discover', label: '🔭 Discover' },
];

export default function MoviesPage() {
  const [activeTab, setActiveTab] = useState('trending');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [showFilters, setShowFilters] = useState(false);

  const fetchMovies = useCallback(async (p = 1, reset = true) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      const params = { page: p };

      switch (activeTab) {
        case 'trending': res = await moviesAPI.getTrending(params); break;
        case 'popular': res = await moviesAPI.getPopular(params); break;
        case 'top_rated': res = await moviesAPI.getTopRated(params); break;
        case 'now_playing': res = await moviesAPI.getNowPlaying(params); break;
        case 'upcoming': res = await moviesAPI.getUpcoming(params); break;
        case 'discover':
          res = await moviesAPI.discover({
            ...params,
            sort_by: sortBy,
            ...(selectedGenres.length && { with_genres: selectedGenres.join(',') })
          });
          break;
        default: res = await moviesAPI.getTrending(params);
      }

      const results = res.data.results || [];
      setMovies(reset ? results : prev => [...prev, ...results]);
      setTotalPages(res.data.total_pages || 1);
      setPage(p);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [activeTab, sortBy, selectedGenres]);

  useEffect(() => {
    setPage(1);
    fetchMovies(1, true);
  }, [activeTab, sortBy, selectedGenres]);

  const loadMore = () => {
    if (page < totalPages) fetchMovies(page + 1, false);
  };

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Film size={28} className="text-brand-400" />
          <h1 className="font-display text-3xl font-bold gradient-text">Movies</h1>
        </div>
        <p className="text-white/40 text-sm">Explore thousands of movies</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === tab.key
                ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                : 'text-white/50 hover:text-white bg-white/5 border border-white/8 hover:bg-white/8'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters (for Discover tab) */}
      {activeTab === 'discover' && (
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white glass rounded-xl px-4 py-2 transition-all mb-4"
          >
            <SlidersHorizontal size={15} />
            Filters
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass rounded-2xl p-5 mb-4 space-y-4"
            >
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Sort By</p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setSortBy(opt.value)}
                      className={`px-4 py-1.5 rounded-xl text-sm transition-all border
                        ${sortBy === opt.value ? 'bg-brand-600/20 text-brand-400 border-brand-500/30' : 'text-white/50 border-white/10 hover:text-white hover:border-white/20'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Genres</p>
                <GenreFilter selected={selectedGenres} onChange={setSelectedGenres} />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Grid */}
      <MovieGrid movies={movies} loading={loading && page === 1} error={error} />

      {/* Load more */}
      {!loading && page < totalPages && movies.length > 0 && (
        <div className="flex justify-center mt-8">
          <button onClick={loadMore} className="btn-ghost">
            Load More Movies
          </button>
        </div>
      )}

      {/* Loading more indicator */}
      {loading && page > 1 && (
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
