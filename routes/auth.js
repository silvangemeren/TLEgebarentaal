import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import fetch from 'node-fetch';
import LoginCode from '../Models/LoginCode.js';

const router = express.Router();

// POST: Login route
router.post('/login', async (req, res) => {
    const { email, token } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        const response = await fetch(`https://cmgt.hr.nl/api/validate-sso-token`, {
            method: 'GET',
            headers: { Token: `${token}`, 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {

            const responseToken = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '5h' }
            );

            res.status(200).json({ responseToken });

        } else {
            return res.status(400).json({ error: "Token is ongeldig of al in gebruik" });
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: 'Serverfout' });
    }
});

// POST: Register route
router.post('/register', async (req, res) => {
    const { name, token, role, email, loginCode } = req.body;

    if (!name || !email || !loginCode) {
        return res.status(400).json({ error: 'Naam, email en loginCode zijn vereist.' });
    }

    const validRoles = ['admin', 'teacher', 'student'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ error: 'Ongeldige rol.' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Deze naam of email is al in gebruik.' });
        }

        const response = await fetch(`https://cmgt.hr.nl/api/validate-sso-token`, {
            method: 'GET',
            headers: { Token: `${token}`, 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {

            const workingLoginCode = await LoginCode.findOne({ loginCode })
            if (!workingLoginCode) {
                return res.status(400).json({ error: 'Deze logincode bestaat niet.' });
            } else {
                if (workingLoginCode === older than 30 minutes)
{
    return res.status(400).json({ error: 'Deze logincode is te oud.' });
}
            };

const newUser = new User({
    name,
    role: role || 'student',
    email,
    loginCode
});

const user = await newUser.save();

const responseToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '5h' }
);

res.status(200).json({ responseToken });

        } else {
    return res.status(400).json({ error: "Token is ongeldig of al in gebruik" });
}
    } catch (error) {
    console.error('❌ Error during registration:', error); // <-- Voeg deze regel toe!
    res.status(500).json({ error: 'Serverfout bij registreren.', details: error.message }); // <-- Geef details terug
}
});


export default router;


//https://cmgt.hr.nl/chat-login/handle/tle2-1?redirect=http://localhost:8000/auth/register
