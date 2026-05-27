const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email and password.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        favorites: user.favorites,
        watchlist: user.watchlist,
        preferredGenres: user.preferredGenres
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        favorites: user.favorites,
        watchlist: user.watchlist,
        preferredGenres: user.preferredGenres
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, preferredGenres } = req.body;
    const update = {};
    if (name) update.name = name;
    if (avatar !== undefined) update.avatar = avatar;
    if (preferredGenres) update.preferredGenres = preferredGenres;

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile.' });
  }
};
