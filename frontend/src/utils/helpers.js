const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return `https://via.placeholder.com/500x750/0d1224/ff3932?text=No+Poster`;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getPosterUrl = (path) => getImageUrl(path, 'w500');
export const getBackdropUrl = (path) => getImageUrl(path, 'w1280');
export const getProfileUrl = (path) => getImageUrl(path, 'w185');
export const getOriginalUrl = (path) => getImageUrl(path, 'original');

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatYear = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear();
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatCurrency = (amount) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(amount);
};

export const getRatingColor = (rating) => {
  if (rating >= 8) return 'text-green-400';
  if (rating >= 6) return 'text-gold-400';
  if (rating >= 4) return 'text-orange-400';
  return 'text-red-400';
};

export const getRatingBg = (rating) => {
  if (rating >= 8) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (rating >= 6) return 'bg-gold-500/20 text-gold-400 border-gold-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
};

export const truncate = (str, n) => str?.length > n ? str.substring(0, n) + '...' : str;

export const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western'
};
