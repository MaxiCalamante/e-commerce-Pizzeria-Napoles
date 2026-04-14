const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        // Validación de duplicados
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ error: 'El email ya se encuentra registrado.' });
        }

        // Crear usuario con password hasheado
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: { email: newUser.email, role: newUser.role } });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor en registro.' });
    }
};

const loginLocal = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: info.message });
        }

        // Generar JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'super_secret_jwt_key',
            { expiresIn: '1h' }
        );

        // Guardar token en Cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1h
        });

        // Configurar la sesión por seguridad/híbrido si es requerido (guardando userId en sess)
        req.session.user = { userId: user._id, role: user.role, email: user.email };

        // Devolver response JSON
        return res.json({ 
            message: 'Login exitoso', 
            token,
            user: { email: user.email, role: user.role }
        });
    })(req, res, next);
};

const githubCallback = (req, res) => {
    // Generar JWT como en login de formulario (OAuth)
    const token = jwt.sign(
        { userId: req.user._id, role: req.user.role },
        process.env.JWT_SECRET || 'super_secret_jwt_key',
        { expiresIn: '1h' }
    );

    res.cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });

    // Mantenimiento de session
    req.session.user = { userId: req.user._id, role: req.user.role, email: req.user.email };

    res.json({ message: 'Login con GitHub exitoso', token });
};

const logout = (req, res) => {
    // Limpieza de Cookie
    res.clearCookie('authToken');
    // Destrucción de la sesión
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Fallo al cerrar sesión' });
        }
        res.json({ message: 'Logout exitoso. Cookie y sesión limpiados.' });
    });
};

const getProfile = (req, res) => {
    res.json({ message: 'Ruta protegida por JWT (Profile)', user: req.user });
};

const getAdmin = (req, res) => {
    res.json({ message: 'Ruta de administrador accedida exitosamente', user: req.user });
};

module.exports = {
    register,
    loginLocal,
    githubCallback,
    logout,
    getProfile,
    getAdmin
};
