import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, History, X, TrendingUp } from 'lucide-react';
import { moviesAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/movie/MovieGrid';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [history, setHistory] = useState([]);

  // Load search history
  useEffect(() => {
    if (isAuthenticated) {
      userAPI.getSearchHistory()
        .then(({ data }) => setHistory(data.searchHistory?.slice(0, 8) || []))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Search when query changes
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(() => search(1), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const search = async (p = 1) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await moviesAPI.search({ query, page: p });
      setResults(p === 1 ? data.results || [] : prev => [...prev, ...(data.results || [])]);
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || 0);
      setPage(p);
      // Save to history
      if (isAuthenticated && p === 1) {
        userAPI.addSearchHistory(query).catch(() => {});
      }
      setSearchParams({ q: query });
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') search(1); };

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold gradient-text mb-1 flex items-center gap-3">
          <Search size={28} className="text-brand-400" /> Search
        </h1>
        <p className="text-white/40 text-sm">Find any movie in our database</p>
      </motion.div>

      {/* Search input */}
      <div className="relative max-w-2xl mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search for movies, directors, genres..."
          className="input-field pl-12 pr-12 py-4 text-base"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Empty state: search history + suggestions */}
      {!query && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {history.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-white/50 text-sm font-medium mb-3 uppercase tracking-wider">
                <History size={14} /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <button key={i} onClick={() => setQuery(h.query)}
                    className="genre-pill flex items-center gap-1.5">
                    <History size={12} /> {h.query}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="flex items-center gap-2 text-white/50 text-sm font-medium mb-3 uppercase tracking-wider">
              <TrendingUp size={14} /> Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Avengers', 'Spider-Man', 'Batman', 'Inception', 'Interstellar', 'Dune', 'Oppenheimer', 'Barbie'].map(s => (
                <button key={s} onClick={() => setQuery(s)} className="genre-pill">{s}</button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {query && (
        <div>
          {results.length > 0 && !loading && (
            <p className="text-white/40 text-sm mb-5">
              Found <span className="text-white font-medium">{totalResults.toLocaleString()}</span> results for
              <span className="text-brand-400 ml-1">"{query}"</span>
            </p>
          )}

          <MovieGrid movies={results} loading={loading && page === 1} error={error} />

          {!loading && results.length === 0 && query && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
              <p className="text-white/40">Try a different search term</p>
            </div>
          )}

          {!loading && page < totalPages && results.length > 0 && (
            <div className="flex justify-center mt-8">
              <button onClick={() => search(page + 1)} className="btn-ghost">
                Load More Results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
