import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules';
import MovieCard from './MovieCard';
import SkeletonCard from '../common/SkeletonCard';

export default function MovieCarousel({
  movies = [],
  loading = false,
  title,
  subtitle,
  icon,
  autoplay = false,
  slidesPerView = 'auto',
  showNav = true
}) {
  const swiperSettings = {
    modules: [Navigation, Pagination, FreeMode, ...(autoplay ? [Autoplay] : [])],
    spaceBetween: 16,
    navigation: showNav,
    freeMode: true,
    grabCursor: true,
    ...(autoplay && { autoplay: { delay: 3500, disableOnInteraction: false } }),
    breakpoints: {
      320: { slidesPerView: 2.2 },
      480: { slidesPerView: 2.8 },
      640: { slidesPerView: 3.5 },
      768: { slidesPerView: 4.2 },
      1024: { slidesPerView: 5 },
      1280: { slidesPerView: 5.5 },
    }
  };

  return (
    <section className="mb-10">
      {(title || subtitle) && (
        <div className="flex items-end justify-between mb-5 px-1">
          <div className="flex items-center gap-3">
            {icon && <span className="text-2xl">{icon}</span>}
            <div>
              {title && <h2 className="section-title">{title}</h2>}
              {subtitle && <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      <Swiper {...swiperSettings} className="!overflow-visible">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <SwiperSlide key={i} style={{ width: '180px' }}>
              <SkeletonCard />
            </SwiperSlide>
          ))
          : movies.map((movie, i) => (
            <SwiperSlide key={movie.id}>
              <MovieCard movie={movie} index={i} />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </section>
  );
}
