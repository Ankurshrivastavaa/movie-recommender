import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9!@#$%^&*]/.test(pwd)) score++;
  return score;
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill all fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome to CineAI 🎬');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg)`,
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/30 to-dark-900" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-glow-red">
              <Sparkles size={22} className="text-white" />
            </div>
            <span className="font-display text-3xl font-bold gradient-text">CineAI</span>
          </Link>

          <h2 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Start your<br />
            <span className="gradient-text">movie journey</span>
          </h2>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              'AI-powered personalized recommendations',
              'Build your favorites & watchlist',
              'Track your viewing history',
              'Discover hidden cinematic gems',
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-brand-600/20 border border-brand-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-brand-400" />
                </div>
                <span className="text-white/60 text-sm">{benefit}</span>
              </motion.div>
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
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">CineAI</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-white/40 text-sm mb-8">Join thousands of movie enthusiasts</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? STRENGTH_COLORS[strength] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-white/30">
                    Password strength: <span className={`font-medium ${strength >= 3 ? 'text-green-400' : strength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {STRENGTH_LABELS[strength]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>

          <p className="text-center text-white/20 text-xs mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
