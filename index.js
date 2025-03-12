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
import apiKeysRouter from './routes/apiKeys.js'
import aboutRoutes from "./routes/about.js";
import authRoutes from "./routes/auth.js";
import validateApiKey from "./Middlewares/apiAuth.js";
import { authenticateUser } from './Middlewares/auth.js';
import { authorize } from './Middlewares/auth.js';

const app = express()
const port = process.env.EXPRESS_PORT

mongoose.connect('mongodb://127.0.0.1:27017/signs')

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
    next();
})


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
app.use('/about', authorize('teacher', 'admin', 'student'), aboutRoutes);
app.use('/videos', authorize('teacher', 'admin', 'student'), videos);
app.use('/gifs', authorize('teacher', 'admin', 'student'), gifs);
app.use('/handshapes', authorize('teacher', 'admin', 'student'), handshapes);
app.use('/mouthshapes', authorize('teacher', 'admin', 'student'), mouthshapes);
app.use('/theorybook', authorize('teacher', 'admin', 'student'), theorybook);
app.use('/playlist', authorize('student'), customplaylist);

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

// Users route
app.use('/users', users);

app.listen(port, () => {
    console.log(`Sign language app is listening on port ${port}`);
});