import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Giant 404 */}
        <div className="relative mb-8">
          <p className="font-display text-[160px] font-bold leading-none text-white/5 select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <Film size={80} className="text-brand-600/40" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-3">Scene Not Found</h1>
        <p className="text-white/40 leading-relaxed mb-8">
          This page seems to have been cut from the final edit. Let's get you back to the main feature.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/movies" className="btn-ghost">
            <Film size={16} /> Browse Movies
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
