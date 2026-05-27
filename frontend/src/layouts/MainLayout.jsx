import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Film, Search, Heart, Bookmark, LayoutDashboard,
  LogIn, LogOut, Menu, X, Flame, Star, Sparkles, ChevronRight, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../hooks/useMovies';
import { getPosterUrl } from '../utils/helpers';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/movies', icon: Film, label: 'Movies' },
  { to: '/search', icon: Search, label: 'Search' },
];

const authNavItems = [
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/watchlist', icon: Bookmark, label: 'Watchlist' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { query, setQuery, results, loading: searchLoading } = useSearch();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleSearchSelect = (id) => {
    navigate(`/movie/${id}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-full z-40 glass-dark border-r border-white/[0.05]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.05]">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-glow-red">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold gradient-text">CineAI</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="text-white/25 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Explore</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${location.pathname === to
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <Icon size={18} className={location.pathname === to ? 'text-brand-400' : 'text-white/40 group-hover:text-white/70'} />
              {label}
              {location.pathname === to && <ChevronRight size={14} className="ml-auto text-brand-400" />}
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <p className="text-white/25 text-xs font-semibold uppercase tracking-widest px-3 mb-3 mt-6">My Space</p>
              {authNavItems.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${location.pathname === to
                      ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={18} className={location.pathname === to ? 'text-brand-400' : 'text-white/40 group-hover:text-white/70'} />
                  {label}
                  {location.pathname === to && <ChevronRight size={14} className="ml-auto text-brand-400" />}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/[0.05]">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-600/20 border border-brand-500/30 rounded-xl flex items-center justify-center text-brand-400 font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-white/30 truncate">{user?.email}</p>
              </div>
              <button onClick={logout} className="text-white/30 hover:text-red-400 transition-colors p-1" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/login" className="btn-primary w-full justify-center text-sm py-2">
                <LogIn size={16} /> Sign In
              </Link>
              <Link to="/register" className="btn-ghost w-full justify-center text-sm py-2">
                <User size={16} /> Register
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top nav bar */}
        <header className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'glass-dark shadow-glass' : 'bg-transparent'}`}>
          <div className="flex items-center justify-between px-4 md:px-6 h-14">
            {/* Mobile: logo + menu */}
            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white p-1">
                <Menu size={22} />
              </button>
              <Link to="/" className="font-display text-lg font-bold gradient-text">CineAI</Link>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-md mx-4 relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  placeholder="Search movies..."
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-500/50 focus:bg-white/8 transition-all"
                />
              </div>

              {/* Search dropdown */}
              <AnimatePresence>
                {searchOpen && query && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-2 w-full glass-dark rounded-xl border border-white/8 shadow-card overflow-hidden z-50"
                  >
                    {searchLoading ? (
                      <div className="p-4 text-center text-white/40 text-sm">Searching...</div>
                    ) : results.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto">
                        {results.slice(0, 6).map(m => (
                          <button key={m.id} onClick={() => handleSearchSelect(m.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left">
                            <img src={getPosterUrl(m.poster_path)} alt={m.title}
                              className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{m.title}</p>
                              <p className="text-xs text-white/40">{m.release_date?.split('-')[0]} • ⭐ {m.vote_average?.toFixed(1)}</p>
                            </div>
                          </button>
                        ))}
                        <Link to={`/search?q=${query}`} onClick={() => setSearchOpen(false)}
                          className="block px-4 py-3 text-center text-sm text-brand-400 hover:bg-white/5 border-t border-white/5 transition-colors">
                          See all results →
                        </Link>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-white/40 text-sm">No results for "{query}"</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link to="/dashboard" className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors">
                  <div className="w-6 h-6 bg-brand-600/20 rounded-lg flex items-center justify-center text-brand-400 text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user?.name?.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link to="/login" className="btn-primary text-sm py-1.5 px-4">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-white/5 text-center">
          <p className="text-white/20 text-sm">
            © 2024 CineAI — Powered by{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-brand-500 hover:text-brand-400">
              TMDB
            </a>
          </p>
        </footer>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-72 z-50 glass-dark border-r border-white/[0.05] flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <Link to="/" className="font-display text-xl font-bold gradient-text">CineAI</Link>
                <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                {[...navItems, ...(isAuthenticated ? authNavItems : [])].map(({ to, icon: Icon, label }) => (
                  <Link key={to} to={to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${location.pathname === to ? 'bg-brand-600/20 text-brand-400' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-white/[0.05]">
                {isAuthenticated ? (
                  <button onClick={logout} className="flex items-center gap-2 text-white/40 hover:text-red-400 text-sm transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="btn-primary w-full justify-center text-sm py-2">Sign In</Link>
                    <Link to="/register" className="btn-ghost w-full justify-center text-sm py-2">Register</Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
