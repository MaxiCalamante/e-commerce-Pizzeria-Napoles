const express = require('express');
const passport = require('passport');
const { register, loginLocal, githubCallback, logout, getProfile, getAdmin } = require('../controllers/auth.controller');
const { isAuth, isAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLocal);

// Autenticación con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallback);

router.post('/logout', logout);

// Rutas protegidas
router.get('/profile', isAuth, getProfile);
router.get('/admin', isAuth, isAdmin, getAdmin);

module.exports = router;
