const express = require('express');
const { getSessionInfo, getCurrentUser } = require('../controllers/session.controller');
const { isAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/session', getSessionInfo);

// Validará al usuario logueado con JWT/Cookie y devolverá sus datos
router.get('/current', isAuth, getCurrentUser);

module.exports = router;
