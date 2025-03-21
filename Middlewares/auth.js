import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

// Middleware om de gebruiker te authenticeren via token
export const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Geen token, toegang geweigerd' });
    }
    const tokenValue = token.split(' ')[1];

    try {
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Ongeldige token:', error);
        res.status(401).json({ error: 'Ongeldige token' });
    }
};

// Middleware om te controleren of de gebruiker admin of teacher is
export const isAdminOrTeacher = (req, res, next) => {
    if (!req.user || !['admin', 'teacher'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Toegang geweigerd: je hebt geen admin of teacher rechten' });
    }
    next();
};

// Middleware om te controleren of de gebruiker een admin is
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Toegang geweigerd: alleen admins hebben toegang.' });
};

// Middleware voor flexibele autorisatie op basis van rollen
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ error: 'Toegang geweigerd.' });
    };
};