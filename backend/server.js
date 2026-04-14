require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('./strategies/passport');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const sessionRoutes = require('./routes/session.routes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize DB and then start server
connectDB().then((mongoUrl) => {
    
    // Configuración de Sesiones
    app.use(session({
        store: MongoStore.create({
            mongoUrl: mongoUrl,
            ttl: 3600 // 1 hour session
        }),
        secret: process.env.SESSION_SECRET || 'super_secret_session',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production'
        }
    }));

    // Inicializar Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Rutas
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1', sessionRoutes); // Para /api/v1/session
    app.use('/api/sessions', sessionRoutes); // Para /api/sessions/current

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
