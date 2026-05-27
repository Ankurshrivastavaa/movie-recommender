import MovieCard from './MovieCard';
import SkeletonCard from '../common/SkeletonCard';

export default function MovieGrid({ movies, loading, error, showRank = false, columns = 'default' }) {
  const gridClass = {
    default: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4',
    compact: 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3',
    wide: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5',
  }[columns] || 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4';

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">🎬</div>
      <p className="text-white/50 text-lg">Something went wrong</p>
      <p className="text-white/25 text-sm mt-1">{error}</p>
    </div>
  );

  return (
    <div className={gridClass}>
      {loading
        ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
        : movies?.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} showRank={showRank} />
        ))
      }
    </div>
  );
}
