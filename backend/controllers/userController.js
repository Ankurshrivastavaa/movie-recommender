const User = require('../models/User');

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { movieId, title, poster_path, vote_average, release_date } = req.body;
    const user = await User.findById(req.user._id);

    const idx = user.favorites.findIndex(f => f.movieId === Number(movieId));
    let action;

    if (idx > -1) {
      user.favorites.splice(idx, 1);
      action = 'removed';
    } else {
      user.favorites.push({ movieId: Number(movieId), title, poster_path, vote_average, release_date });
      action = 'added';
    }

    await user.save();
    res.json({ success: true, action, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle watchlist
exports.toggleWatchlist = async (req, res) => {
  try {
    const { movieId, title, poster_path, vote_average, release_date } = req.body;
    const user = await User.findById(req.user._id);

    const idx = user.watchlist.findIndex(w => w.movieId === Number(movieId));
    let action;

    if (idx > -1) {
      user.watchlist.splice(idx, 1);
      action = 'removed';
    } else {
      user.watchlist.push({ movieId: Number(movieId), title, poster_path, vote_average, release_date });
      action = 'added';
    }

    await user.save();
    res.json({ success: true, action, watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites');
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchlist');
    res.json({ success: true, watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to search history
exports.addSearchHistory = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required.' });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          $each: [{ query, searchedAt: new Date() }],
          $slice: -20
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get search history
exports.getSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('searchHistory');
    res.json({ success: true, searchHistory: user.searchHistory.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rate movie
exports.rateMovie = async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const user = await User.findById(req.user._id);

    const idx = user.ratings.findIndex(r => r.movieId === Number(movieId));
    if (idx > -1) {
      user.ratings[idx].rating = rating;
      user.ratings[idx].ratedAt = new Date();
    } else {
      user.ratings.push({ movieId: Number(movieId), rating });
    }

    await user.save();
    res.json({ success: true, ratings: user.ratings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update preferred genres
exports.updateGenres = async (req, res) => {
  try {
    const { genres } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferredGenres: genres },
      { new: true }
    );
    res.json({ success: true, preferredGenres: user.preferredGenres });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      stats: {
        favorites: user.favorites.length,
        watchlist: user.watchlist.length,
        rated: user.ratings.length,
        searches: user.searchHistory.length,
        recentFavorites: user.favorites.slice(-4).reverse(),
        recentWatchlist: user.watchlist.slice(-4).reverse()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
