const passport = require('passport');

// Middleware para verificar JWT y obtener req.user
const isAuth = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: 'No autenticado. Token JWT inválido o no provisto.' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

// Middleware para validar rol 'admin'
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado. Permisos insuficientes.' });
    }
    next();
};

module.exports = {
    isAuth,
    isAdmin
};
