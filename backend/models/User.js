const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  favorites: [{
    movieId: { type: Number, required: true },
    title: String,
    poster_path: String,
    vote_average: Number,
    release_date: String,
    addedAt: { type: Date, default: Date.now }
  }],
  watchlist: [{
    movieId: { type: Number, required: true },
    title: String,
    poster_path: String,
    vote_average: Number,
    release_date: String,
    addedAt: { type: Date, default: Date.now }
  }],
  searchHistory: [{
    query: String,
    searchedAt: { type: Date, default: Date.now }
  }],
  preferredGenres: [{
    type: Number
  }],
  ratings: [{
    movieId: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 10 },
    ratedAt: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
