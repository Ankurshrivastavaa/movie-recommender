import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Heart, Bookmark, Star, Search,
  Film, Edit2, Check, X, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, authAPI } from '../services/api';
import { getPosterUrl, formatDate } from '../utils/helpers';
import GenreFilter from '../components/common/GenreFilter';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to || '#'}>
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className="glass rounded-2xl p-5 cursor-pointer group hover:border-white/15 transition-all border border-white/5"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-3xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-white/40 text-sm">{label}</p>
    </motion.div>
  </Link>
);

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [selectedGenres, setSelectedGenres] = useState(user?.preferredGenres || []);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    userAPI.getDashboard()
      .then(({ data }) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await authAPI.updateProfile({ name: editName, preferredGenres: selectedGenres });
      await userAPI.updateGenres(selectedGenres);
      updateUser({ name: editName, preferredGenres: selectedGenres });
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const statCards = [
    { icon: Heart, label: 'Favorites', value: stats?.favorites ?? '—', color: 'bg-red-500/20', to: '/favorites' },
    { icon: Bookmark, label: 'Watchlist', value: stats?.watchlist ?? '—', color: 'bg-brand-600/20', to: '/watchlist' },
    { icon: Star, label: 'Rated Movies', value: stats?.rated ?? '—', color: 'bg-gold-500/20', to: '#' },
    { icon: Search, label: 'Searches', value: stats?.searches ?? '—', color: 'bg-blue-500/20', to: '/search' },
  ];

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <LayoutDashboard size={26} className="text-brand-400" />
          <h1 className="font-display text-3xl font-bold gradient-text">Dashboard</h1>
        </div>
        <p className="text-white/40 text-sm">Your personal movie hub</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Profile */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-20 h-20 bg-brand-600/20 border-2 border-brand-500/30 rounded-full flex items-center justify-center text-brand-400 font-display text-3xl font-bold mb-3 shadow-glow-red">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {editing ? (
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="input-field text-center text-lg font-semibold"
                />
              ) : (
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              )}
              <p className="text-white/35 text-sm mt-1">{user?.email}</p>
              <p className="text-white/20 text-xs mt-1">Member since {formatDate(user?.createdAt)}</p>
            </div>

            {/* Edit toggle */}
            {editing ? (
              <div className="flex gap-2">
                <button onClick={saveProfile} disabled={savingProfile}
                  className="btn-primary flex-1 justify-center py-2 text-sm disabled:opacity-60">
                  {savingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={14} /> Save</>}
                </button>
                <button onClick={() => setEditing(false)} className="btn-ghost py-2 px-3">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-ghost w-full justify-center py-2 text-sm">
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </motion.div>

          {/* Preferred Genres */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-brand-400" />
              <h3 className="text-white font-semibold text-sm">Preferred Genres</h3>
            </div>
            <p className="text-white/35 text-xs mb-3">These improve your recommendations</p>
            <GenreFilter selected={selectedGenres} onChange={setSelectedGenres} />
            {editing && (
              <button onClick={saveProfile} className="btn-primary w-full justify-center py-2 text-sm mt-3">
                <Check size={14} /> Save Genres
              </button>
            )}
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-brand-400 text-xs hover:text-brand-300 transition-colors mt-3">
                + Update genres
              </button>
            )}
          </motion.div>
        </div>

        {/* Right column - Stats + Recent */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statCards.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <StatCard {...card} />
              </motion.div>
            ))}
          </div>

          {/* Recent favorites */}
          {stats?.recentFavorites?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Heart size={15} className="text-red-400" /> Recent Favorites
                </h3>
                <Link to="/favorites" className="text-brand-400 text-xs hover:text-brand-300">View all →</Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {stats.recentFavorites.map(m => (
                  <Link key={m.movieId} to={`/movie/${m.movieId}`}>
                    <div className="group relative rounded-xl overflow-hidden aspect-[2/3]">
                      <img src={getPosterUrl(m.poster_path)} alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">{m.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent watchlist */}
          {stats?.recentWatchlist?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Bookmark size={15} className="text-brand-400" /> Recent Watchlist
                </h3>
                <Link to="/watchlist" className="text-brand-400 text-xs hover:text-brand-300">View all →</Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {stats.recentWatchlist.map(m => (
                  <Link key={m.movieId} to={`/movie/${m.movieId}`}>
                    <div className="group relative rounded-xl overflow-hidden aspect-[2/3]">
                      <img src={getPosterUrl(m.poster_path)} alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">{m.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && stats?.favorites === 0 && stats?.watchlist === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-10 text-center">
              <Film size={48} className="text-white/20 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Your dashboard is empty</h3>
              <p className="text-white/40 text-sm mb-5">Start exploring movies and build your collection</p>
              <Link to="/movies" className="btn-primary inline-flex">
                <Film size={16} /> Browse Movies
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
