import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎬');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left - Cinematic panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280/rYFAvSPlQUCebayLExlabznkBO1.jpg)`,
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/20 to-dark-900" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-glow-red">
              <Sparkles size={22} className="text-white" />
            </div>
            <span className="font-display text-3xl font-bold gradient-text">CineAI</span>
          </Link>

          <h2 className="font-display text-5xl font-bold text-white leading-tight mb-4">
            Your cinematic<br />
            <span className="gradient-text">journey awaits</span>
          </h2>
          <p className="text-white/50 text-lg max-w-sm leading-relaxed">
            Discover movies tailored to your taste, build your watchlist, and get AI-powered recommendations.
          </p>

          {/* Floating movie cards decoration */}
          <div className="mt-12 flex gap-3">
            {['w92/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', 'w92/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 'w92/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'].map((img, i) => (
              <motion.img key={i} src={`https://image.tmdb.org/t/p/${img}`}
                className="w-16 h-24 rounded-xl object-cover border border-white/10"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, delay: i * 0.8, repeat: Infinity }}
                onError={e => e.target.style.display = 'none'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">CineAI</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          {/* Demo account */}
          <div className="mt-4 glass rounded-xl p-3 text-center">
            <p className="text-white/30 text-xs mb-1">Demo account</p>
            <p className="text-white/50 text-xs">demo@cineai.app / demo123</p>
          </div>

          <p className="text-center text-white/40 text-sm mt-6">
            New to CineAI?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
