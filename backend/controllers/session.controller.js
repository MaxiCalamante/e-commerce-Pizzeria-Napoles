const getSessionInfo = (req, res) => {
    // Retorna la información almacenada en express-session
    if (req.session && req.session.user) {
        res.json({ session: req.session.user });
    } else {
        res.status(401).json({ error: 'No hay sesión activa' });
    }
};

const getCurrentUser = (req, res) => {
    // passport authenticate('current') inyecta al usuario en req.user
    if (req.user) {
        res.json({ current_user: req.user });
    } else {
        res.status(401).json({ error: 'Fallo al obtener el usuario actual desde el JWT' });
    }
};

module.exports = {
    getSessionInfo,
    getCurrentUser
};
