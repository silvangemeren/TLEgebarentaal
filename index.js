import express from 'express';
import mongoose from 'mongoose';

const app = express()
const port = process.env.EXPRESS_PORT

mongoose.connect('mongodb://127.0.0.1:27017/fishes')

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
    next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    console.log(`Sign language app is listening on port ${port}`)
})