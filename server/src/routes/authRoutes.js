const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { validateAuth } = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
