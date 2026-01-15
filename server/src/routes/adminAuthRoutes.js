const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/adminAuthController');
const { validateAuth } = require('../middlewares/validation');

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);

module.exports = router;