# 🎬 CineAI — Full Stack Movie Recommender System

> A production-ready, premium movie discovery platform built with React, Node.js, MongoDB, and the TMDB API. Features AI-powered recommendations, user authentication, favorites/watchlist management, and a cinematic dark-mode UI inspired by Netflix and IMDb.

![CineAI Preview](https://image.tmdb.org/t/p/w1280/rYFAvSPlQUCebayLExlabznkBO1.jpg)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 Smart Recommendations | Personalized picks based on genres, favorites & history |
| 🔍 Instant Search | Debounced search with live dropdown results |
| 🔥 Trending / Popular | Real-time data from TMDB API |
| 🎬 Movie Detail Page | Full cast, crew, trailers, reviews & similar films |
| ❤️ Favorites | Save and manage your favorite movies |
| 📌 Watchlist | Queue movies to watch later with "mark watched" |
| 👤 Auth | JWT-based registration and login |
| 📊 Dashboard | Personal stats, genre preferences, activity feed |
| 🌑 Dark Mode | Premium cinematic dark UI throughout |
| 📱 Responsive | Mobile-first, fully responsive layout |
| ✨ Animations | Framer Motion page transitions and micro-interactions |
| 💀 Skeletons | Loading skeleton states for all data |

---

## 🧱 Tech Stack

### Frontend
- **React 18** + **Vite** — blazing-fast bundler
- **Tailwind CSS** — utility-first styling with custom design tokens
- **Framer Motion** — animations and transitions
- **Swiper.js** — touch-friendly carousels
- **Axios** — HTTP client with JWT interceptors
- **React Router v6** — client-side routing with protected routes
- **React Hot Toast** — sleek notifications
- **Lucide React** — modern icon set

### Backend
- **Node.js** + **Express.js** — REST API server
- **MongoDB** + **Mongoose** — database and ODM
- **JWT** (jsonwebtoken) — stateless auth
- **bcryptjs** — password hashing
- **Helmet** + **CORS** — security headers
- **express-rate-limit** — API rate limiting
- **Morgan** — HTTP request logging
- **node-fetch** — TMDB API proxy

### External API
- **[TMDB (The Movie Database)](https://www.themoviedb.org/documentation/api)** — movies, posters, metadata

---

## 📁 Project Structure

```
movie-recommender/
│
├── frontend/                          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── GenreFilter.jsx    # Genre tag selector
│   │   │   │   └── SkeletonCard.jsx   # Loading skeleton
│   │   │   └── movie/
│   │   │       ├── HeroBanner.jsx     # Auto-rotating hero carousel
│   │   │       ├── MovieCard.jsx      # Individual movie card
│   │   │       ├── MovieCarousel.jsx  # Swiper horizontal slider
│   │   │       └── MovieGrid.jsx      # Responsive CSS grid
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state
│   │   ├── hooks/
│   │   │   └── useMovies.js           # Movie fetching + action hooks
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx         # Nav, sidebar, footer
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Landing + carousels
│   │   │   ├── MoviesPage.jsx         # Browse + filter + discover
│   │   │   ├── MovieDetailPage.jsx    # Full movie info
│   │   │   ├── SearchPage.jsx         # Search + history
│   │   │   ├── LoginPage.jsx          # Auth form
│   │   │   ├── RegisterPage.jsx       # Registration form
│   │   │   ├── DashboardPage.jsx      # User profile + stats
│   │   │   ├── FavoritesPage.jsx      # Saved favorites
│   │   │   ├── WatchlistPage.jsx      # Movies to watch
│   │   │   └── NotFoundPage.jsx       # 404
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance + API modules
│   │   ├── utils/
│   │   │   └── helpers.js             # Image URLs, formatting utils
│   │   ├── index.css                  # Global styles + Tailwind
│   │   ├── App.jsx                    # Router setup
│   │   └── main.jsx                   # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── backend/                           # Node.js + Express backend
│   ├── controllers/
│   │   ├── authController.js          # Register, login, profile
│   │   ├── movieController.js         # TMDB proxy endpoints
│   │   ├── userController.js          # Favorites, watchlist, ratings
│   │   └── recommendController.js     # Recommendation logic
│   ├── middleware/
│   │   └── auth.js                    # JWT protect middleware
│   ├── models/
│   │   └── User.js                    # Mongoose user schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movies.js
│   │   ├── users.js
│   │   └── recommendations.js
│   ├── server.js                      # Express app entry
│   ├── .env.example
│   └── package.json
│
├── package.json                       # Root concurrently scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.x
- MongoDB (local or Atlas)
- TMDB API Key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### 1. Clone & Install

```bash
git clone https://github.com/yourname/movie-recommender.git
cd movie-recommender

# Install all dependencies at once
npm run install:all
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/movierecommender
JWT_SECRET=your_super_secret_key_min_32_chars_change_this
JWT_EXPIRES_IN=7d
TMDB_API_KEY=your_tmdb_api_key_here
CLIENT_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
VITE_APP_NAME=CineAI
```

### 3. Get Your TMDB API Key

1. Visit [themoviedb.org](https://www.themoviedb.org) and create a free account
2. Go to **Settings → API → Create** (choose Developer)
3. Copy the **API Key (v3 auth)** — it's a 32-character hex string
4. Paste into `backend/.env` as `TMDB_API_KEY`

### 4. Start Development Servers

```bash
# From root — starts both frontend and backend
npm run dev
```

Or separately:
```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

### 5. Open the App

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

---

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create new account |
| POST | `/auth/login` | No | Login and get JWT |
| GET | `/auth/me` | ✅ | Get current user |
| PUT | `/auth/profile` | ✅ | Update name/avatar/genres |

**Register body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```

**Login response:**
```json
{
  "success": true,
  "token": "eyJhbG...",
  "user": { "_id": "...", "name": "John", "email": "...", "favorites": [], "watchlist": [] }
}
```

---

### Movie Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/movies/trending` | No | Trending this week |
| GET | `/movies/popular` | No | Popular movies |
| GET | `/movies/top-rated` | No | Top rated all-time |
| GET | `/movies/now-playing` | No | In theaters now |
| GET | `/movies/upcoming` | No | Coming soon |
| GET | `/movies/:id` | No | Full movie details |
| GET | `/movies/search?query=Batman` | No | Search movies |
| GET | `/movies/genres` | No | All genre list |
| GET | `/movies/discover?sort_by=popularity.desc&with_genres=28,12` | No | Advanced filter |

---

### User Endpoints (All require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/favorites` | Get favorites list |
| POST | `/users/favorites` | Toggle favorite |
| GET | `/users/watchlist` | Get watchlist |
| POST | `/users/watchlist` | Toggle watchlist |
| POST | `/users/search-history` | Save a search |
| GET | `/users/search-history` | Get recent searches |
| POST | `/users/rate` | Rate a movie |
| PUT | `/users/genres` | Set preferred genres |
| GET | `/users/dashboard` | Dashboard stats |

**Toggle favorite body:**
```json
{
  "movieId": 550,
  "title": "Fight Club",
  "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "vote_average": 8.4,
  "release_date": "1999-10-15"
}
```

---

### Recommendation Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/recommendations/personalized` | ✅ | AI picks for user |
| GET | `/recommendations/similar/:id` | No | Similar to a movie |
| GET | `/recommendations/by-genre?genre_id=28` | No | By genre |

---

## 🗄️ MongoDB Schema

### User Schema
```js
{
  name: String,             // required, 2-50 chars
  email: String,            // unique, validated
  password: String,         // bcrypt hashed, select: false
  avatar: String,           // URL or empty
  favorites: [{
    movieId: Number,
    title: String,
    poster_path: String,
    vote_average: Number,
    release_date: String,
    addedAt: Date
  }],
  watchlist: [/* same shape as favorites */],
  searchHistory: [{
    query: String,
    searchedAt: Date
  }],
  preferredGenres: [Number],   // TMDB genre IDs
  ratings: [{
    movieId: Number,
    rating: Number,           // 1-10
    ratedAt: Date
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-600` | `#ed1a12` | Primary actions, CTAs |
| `brand-400` | `#ff6560` | Accents, highlights |
| `dark-900` | `#050810` | Page background |
| `dark-700` | `#0d1224` | Card backgrounds |
| `gold-400` | `#fbbf24` | Ratings, stars |

### Typography
- **Display:** Playfair Display (headings, titles)
- **Body:** DM Sans (UI text, paragraphs)

### CSS Classes
```css
.glass          /* Glassmorphism card */
.glass-dark     /* Dark glassmorphism */
.btn-primary    /* Red CTA button */
.btn-ghost      /* Outline ghost button */
.movie-card     /* Hoverable movie card */
.input-field    /* Dark styled input */
.section-title  /* Section headings */
.gradient-text  /* Red gradient text */
.skeleton       /* Shimmer loading */
.genre-pill     /* Genre tag button */
```

---

## ☁️ Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
```

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variables:
   - `VITE_API_URL` = your Render backend URL + `/api`

### Backend → Render

1. Push backend folder to GitHub
2. Create **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — strong random string (32+ chars)
   - `TMDB_API_KEY` — your TMDB key
   - `CLIENT_URL` — your Vercel frontend URL
   - `NODE_ENV` = `production`

### MongoDB Atlas Setup

1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create database user (remember username/password)
3. Add `0.0.0.0/0` to Network Access (for Render)
4. Copy connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/movierecommender
   ```

---

## 🔒 Security Features

- JWT token expiry (configurable, default 7 days)
- bcrypt password hashing (salt rounds: 12)
- Helmet.js security headers
- CORS origin whitelist
- Rate limiting: 200 requests per 15 minutes per IP
- Input validation with `validator.js`
- Protected routes on frontend (ProtectedRoute HOC)
- Token auto-refresh / cleanup on 401

---

## 🎯 Recommendation Algorithm

The personalized recommendation engine works in layers:

1. **Genre Matching** — Uses `preferredGenres` from user profile to discover top-voted films
2. **Favorites-Based** — Finds movies similar to and recommended based on the user's last favorite
3. **Collaborative Signal** — Falls back to TMDB's trending + top-rated as a cold-start
4. **Deduplication** — Removes already-favorited movies and duplicate entries
5. **Scoring** — Combines `popularity` (30%) and `vote_average` (70%) for final ranking

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Check `CLIENT_URL` in backend `.env` matches frontend URL |
| 401 Unauthorized | Check JWT_SECRET matches; clear localStorage |
| No posters | TMDB API key not set or invalid |
| MongoDB ECONNREFUSED | MongoDB not running; check URI |
| Movies not loading | Verify `TMDB_API_KEY` in backend `.env` |
| Vite proxy error | Ensure backend is running on port 5000 |

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Credits

- Movie data by [TMDB](https://www.themoviedb.org)
- Icons by [Lucide](https://lucide.dev)
- UI inspiration from Netflix and IMDb
