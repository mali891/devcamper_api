const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/me', protect, getMe).post('/register', register).post('/login', login);

module.exports = router;
