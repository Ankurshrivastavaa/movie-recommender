import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Clock, Sparkles, TrendingUp, Award, Film } from 'lucide-react';
import { moviesAPI, recommendAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import HeroBanner from '../components/movie/HeroBanner';
import MovieCarousel from '../components/movie/MovieCarousel';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [t, p, tr, np, u] = await Promise.allSettled([
          moviesAPI.getTrending(),
          moviesAPI.getPopular(),
          moviesAPI.getTopRated(),
          moviesAPI.getNowPlaying(),
          moviesAPI.getUpcoming(),
        ]);
        if (t.status === 'fulfilled') setTrending(t.value.data.results || []);
        if (p.status === 'fulfilled') setPopular(p.value.data.results || []);
        if (tr.status === 'fulfilled') setTopRated(tr.value.data.results || []);
        if (np.status === 'fulfilled') setNowPlaying(np.value.data.results || []);
        if (u.status === 'fulfilled') setUpcoming(u.value.data.results || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    recommendAPI.getPersonalized()
      .then(({ data }) => setPersonalized(data.results || []))
      .catch(() => {});
  }, [isAuthenticated]);

  // Use trending movies with details for hero (need genres)
  const heroMovies = trending.filter(m => m.backdrop_path).slice(0, 8);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <HeroBanner movies={heroMovies} />

      {/* Main Content */}
      <div className="px-4 md:px-8 py-10 space-y-2">

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: Film, label: 'Movies', value: '500K+', color: 'text-brand-400' },
            { icon: Star, label: 'Top Rated', value: '10K+', color: 'text-gold-400' },
            { icon: Sparkles, label: 'AI Picks', value: 'Daily', color: 'text-blue-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass rounded-2xl p-4 text-center">
              <Icon size={20} className={`${color} mx-auto mb-1`} />
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-white/30 text-xs">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Personalized if logged in */}
        {isAuthenticated && personalized.length > 0 && (
          <MovieCarousel
            movies={personalized}
            title="Recommended For You"
            subtitle="Based on your taste"
            icon="✨"
          />
        )}

        {/* Trending */}
        <MovieCarousel
          movies={trending}
          loading={loading}
          title="Trending This Week"
          subtitle="Most popular right now"
          icon="🔥"
        />

        {/* Now Playing */}
        <MovieCarousel
          movies={nowPlaying}
          loading={loading}
          title="Now Playing"
          subtitle="In theaters this week"
          icon="🎬"
        />

        {/* Top Rated */}
        <MovieCarousel
          movies={topRated}
          loading={loading}
          title="All-Time Greats"
          subtitle="Critically acclaimed masterpieces"
          icon="⭐"
        />

        {/* Popular */}
        <MovieCarousel
          movies={popular}
          loading={loading}
          title="Popular Movies"
          subtitle="Everyone's watching"
          icon="📈"
        />

        {/* Upcoming */}
        <MovieCarousel
          movies={upcoming}
          loading={loading}
          title="Coming Soon"
          subtitle="Upcoming releases to watch out for"
          icon="🚀"
        />
      </div>
    </div>
  );
}

