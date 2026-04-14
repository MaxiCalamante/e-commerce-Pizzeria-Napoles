const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const User = require('../models/User');

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['authToken'];
    }
    return token;
};

// Estrategia Local
passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            const match = bcrypt.compareSync(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Estrategia GitHub (OAuth)
passport.use('github', new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID || 'dummy_client_id',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_client_secret',
        callbackURL: "http://localhost:3000/api/v1/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails ? profile.emails[0].value : `${profile.username}@github.com`;
            let user = await User.findOne({ email });

            if (!user) {
                const nameParts = profile.displayName ? profile.displayName.split(' ') : [profile.username, ''];
                user = new User({
                    first_name: nameParts[0] || profile.username,
                    last_name: nameParts.slice(1).join(' ') || 'N/A',
                    email: email,
                    age: 18, // defaults
                    password: bcrypt.hashSync('github_oauth_random_password_' + Date.now(), 10),
                    role: 'user'
                });
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Estrategia "current" (JWT con extractor de Cookie)
passport.use('current', new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET || 'super_secret_jwt_key',
    },
    async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.userId);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
            // El JWT contiene { userId, role }, acá devolvermos el usuario extraído de la DB
        } catch (error) {
            return done(error, false);
        }
    }
));

// Serializar y deserializar (para uso con sessions, útil si convivimos con OAuth basado en session)
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
