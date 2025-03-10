import express from 'express';
import mongoose from 'mongoose';
import signs from './routes/signs.js';
import videos from './routes/videos.js';
import gifs from './routes/gifs.js';
import about from './routes/about.js';
import auth from './routes/auth.js';

const app = express();
const port = process.env.EXPRESS_PORT || 8000; // Fallback naar 8000 als .env ontbreekt

// Database connectie
mongoose.connect('mongodb://127.0.0.1:27017/signs')
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    next();
});

// Alleen JSON accepteren
app.use((req, res, next) => {
    if (req.headers.accept !== 'application/json' && req.method !== 'OPTIONS') {
        return res.status(406).send('You can only accept JSON');
    }
    next();
});

// Routes
app.use('/signs', signs);
app.use('/videos', videos);
app.use('/gifs', gifs);
app.use('/about', about);
app.use('/auth', auth);

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
