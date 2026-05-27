const express = require('express');
const router = express.Router();
const { getPersonalized, getSimilar, getByGenre } = require('../controllers/recommendController');
const { protect } = require('../middleware/auth');

router.get('/personalized', protect, getPersonalized);
router.get('/similar/:id', getSimilar);
router.get('/by-genre', getByGenre);

module.exports = router;
