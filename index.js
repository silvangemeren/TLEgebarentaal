import express from 'express';
import mongoose from 'mongoose';
import v1 from './routes/v1/index.js';
import v2 from './routes/v2/index.js';

const app = express()
const port = process.env.EXPRESS_PORT

mongoose.connect('mongodb://127.0.0.1:27017/signs')


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Preflight request succesvol afhandelen
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// versie 1 en 2
app.use('/api/v1', v1);
app.use('/api/v2', v2);

app.listen(port, () => {
    console.log(`Sign language app is listening on port ${port}`);
});