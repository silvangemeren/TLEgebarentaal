import express from 'express';
import mongoose from 'mongoose';
import signs from "./routes/signs.js"
import videos from "./routes/videos.js"
import gifs from "./routes/gifs.js"
import handshapes from "./routes/handshapes.js";
import mouthshapes from "./routes/mouthshapes.js";
import customplaylist from "./routes/customplaylist.js"
import theorybook from "./routes/theorybook.js"
import users from "./routes/users.js"
import wordgroups from "./routes/wordgroups.js"
import apiKeysRouter from './routes/apiKeys.js'
import aboutRoutes from "./routes/about.js";
import authRoutes from "./routes/auth.js";
import validateApiKey from "./Middlewares/apiAuth.js";
import { authenticateUser } from './middlewares/auth.js';
import { authorize } from './middlewares/auth.js';

const app = express()
const port = process.env.EXPRESS_PORT

mongoose.connect('mongodb://127.0.0.1:27017/signs')

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
    next();
})

// Files die geen authorisatie en accept json nodig hebben
app.use('/videos', videos);
app.use('/gifs', gifs);
app.use('/handshapes', handshapes);
app.use('/mouthshapes', mouthshapes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.use('/auth', authRoutes);

// Middleware voor authenticatie
app.use(authenticateUser);
app.use(validateApiKey);

// **Routes met autorisatie**
app.use('/apikeys', authorize('admin'), apiKeysRouter); // Alleen admin toegang
app.use('/signs', authorize('teacher', 'admin', 'student'), signs);
app.use('/wordgroups', authorize('teacher', 'admin', 'student'), wordgroups);
app.use('/about', authorize('teacher', 'admin', 'student'), aboutRoutes);
app.use('/theorybook', authorize('teacher', 'admin', 'student'), theorybook);
app.use('/playlist', authorize('teacher', 'admin', 'student'), customplaylist);
app.use('/users', authorize('teacher', 'admin'), users);

// Extra configuratie
app.use((req, res, next) => {
    const acceptHeader = req.headers.accept;

    console.log(`Client accepteert: ${acceptHeader}`);

    if (acceptHeader !== 'application/json' && req.method !== 'OPTIONS') {
        res.status(406).send('You can only accept json');
        return;
    }
    next();
});

app.listen(port, () => {
    console.log(`Sign language app is listening on port ${port}`);
});