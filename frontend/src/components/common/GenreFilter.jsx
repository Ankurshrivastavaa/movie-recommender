import { useState, useEffect } from 'react';
import { moviesAPI } from '../../services/api';

const GENRE_EMOJIS = {
  28: '💥', 12: '🗺️', 16: '🎨', 35: '😂', 80: '🔫', 99: '📽️',
  18: '🎭', 10751: '👨‍👩‍👧', 14: '🧙', 36: '📜', 27: '👻', 10402: '🎵',
  9648: '🔍', 10749: '💕', 878: '🚀', 53: '😱', 10752: '⚔️', 37: '🤠'
};

export default function GenreFilter({ selected = [], onChange }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    moviesAPI.getGenres()
      .then(({ data }) => setGenres(data.genres || []))
      .catch(() => {});
  }, []);

  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter(g => g !== id)
      : [...selected, id];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map(g => (
        <button
          key={g.id}
          onClick={() => toggle(g.id)}
          className={`genre-pill flex items-center gap-1.5 ${selected.includes(g.id) ? 'active' : ''}`}
        >
          <span>{GENRE_EMOJIS[g.id] || '🎬'}</span>
          {g.name}
        </button>
      ))}
    </div>
  );
}
