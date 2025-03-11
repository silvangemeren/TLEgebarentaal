import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../Models/User.js';


const router = express.Router();

// POST: Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Ongeldig wachtwoord' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: 'Serverfout' });
    }
});

// POST: Register route
router.post('/register', async (req, res) => {
    const { username, password, role, email, loginCode } = req.body;

    if (!username || !email || !loginCode) {
        return res.status(400).json({ error: 'Gebruikersnaam, email en loginCode zijn vereist.' });
    }

    const validRoles = ['admin', 'teacher', 'student'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ error: 'Ongeldige rol.' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Deze gebruikersnaam of email is al in gebruik.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || 'student',
            email,
            loginCode
        });

        await newUser.save();

        res.status(201).json({ message: 'Gebruiker succesvol geregistreerd!' });
    } catch (error) {
        console.error('❌ Error during registration:', error);
        res.status(500).json({ error: 'Serverfout bij registreren.' });
    }
});

export default router;
