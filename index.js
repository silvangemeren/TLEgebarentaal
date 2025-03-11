import express from 'express';
import mongoose from 'mongoose';
import signs from "./routes/signs.js"
import videos from "./routes/videos.js"
import gifs from "./routes/gifs.js"
import customplaylist from "./routes/customplaylist.js"
import users from "./routes/users.js"
import apiKeysRouter from './routes/apiKeys.js'
import aboutRoutes from "./routes/about.js";
import authRoutes from "./routes/auth.js";



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

app.use('/videos', videos)
app.use('/gifs', gifs)


app.use((req, res, next) => {
    const acceptHeader = req.headers.accept;

    console.log(`Client accepteert: ${acceptHeader}`);

    if (acceptHeader !== 'application/json' && req.method !== 'OPTIONS') {
        res.status(406).send('You can only accept json');
        return;
    }
    next();
});

app.use('/signs', signs)
app.use('/playlist', customplaylist)

app.use('/users', users)
app.use('/apikeys', apiKeysRouter)
app.use('/about', aboutRoutes)
app.use('/auth', authRoutes)

app.listen(port, () => {
    console.log(`Sign language app is listening on port ${port}`)
})