import express from 'express';
import mongoose from 'mongoose';
import signs from "./routes/signs.js";
import videos from "./routes/videos.js";
import gifs from "./routes/gifs.js";
import customplaylist from "./routes/customplaylist.js";

import users from "./routes/users.js";
import apiKeysRouter from './routes/apiKeys.js';
import aboutRoutes from "./routes/about.js";
import authRoutes from "./routes/auth.js";
import User from "./Models/User.js"; // Zorg dat dit pad klopt

const app = express();
const port = process.env.EXPRESS_PORT;

mongoose.connect('mongodb://127.0.0.1:27017/signs');

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/videos', videos);
app.use('/gifs', gifs);

app.use((req, res, next) => {
    const acceptHeader = req.headers.accept;
    console.log(`Client accepteert: ${acceptHeader}`);
    if (acceptHeader !== 'application/json' && req.method !== 'OPTIONS') {
        res.status(406).send('You can only accept json');
        return;
    }
    next();
});

app.use('/signs', signs);
app.use('/playlist', customplaylist);

app.use('/users', users);
app.use('/apikeys', apiKeysRouter);
app.use('/about', aboutRoutes);
app.use('/auth', authRoutes);

// Zorg dat de TTL-index voor student-accounts wordt ingesteld
async function ensureTTLIndex() {
    try {
        // Verwijder eerst het bestaande index als het bestaat, om conflicten te voorkomen.
        await User.collection.dropIndex("expiresAt_1").catch(err => {
            if (err.codeName !== "IndexNotFound") {
                throw err;
            }
        });
        // Maak vervolgens de TTL-index met partialFilterExpression zodat alleen documenten met role 'student' in aanmerking komen.
        await User.collection.createIndex(
            { expiresAt: 1 },
            { expireAfterSeconds: 0, partialFilterExpression: { role: 'student' } }
        );
        console.log("✅ TTL-index for student deletion is set!");
    } catch (error) {
        console.error("❌ Error setting TTL-index:", error);
    }
}
ensureTTLIndex();

app.listen(port, () => {
    console.log(`Sign language app is listening on port ${port}`);
});
