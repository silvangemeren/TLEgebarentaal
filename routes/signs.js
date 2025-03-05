import express from "express";
import Sign from "../Models/Sign.js";
import signSeeder from '../Data/signSeeder.json' assert { type: 'json' };
import e from "express";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const signs = await Sign.find();
        res.status(200).json(
            {
                "items": signs,
                "_links": {
                    "self": {
                        "href": `${process.env.BASE_URL}/signs`
                    },
                    "collection": {
                        "href": `${process.env.BASE_URL}`
                    }
                },
            })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    if (req.body.method === "SEED") {
        //seeder
        try {
            let amount = req.body.amount
            const reset = req.body.reset
            if (reset) {
                await Sign.deleteMany({})
            }

            const seederSigns = signSeeder.map(sign => ({
                ...sign,
                video: `${process.env.BASE_URL}${sign.video}`,
                gif: `${process.env.BASE_URL}${sign.gif}`
            }));

            for (let i = 0; i < amount; i++) {
                if (i > seederSigns.length - 1) {
                    amount = seederSigns.length
                } else {
                    Sign.create(seederSigns[i])
                }
            }
            res.status(200).json({ message: `Er staan nu ${amount} gebaren in de database en de database is ${reset ? '' : 'niet '}gereset.` })
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        //post
    }
})

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    res.status(204).send();
})

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS, DELETE')
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS, DELETE'])
    res.status(204).send();
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const sign = await Sign.findById(id);
        res.status(200).json(sign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const sign = await Sign.findByIdAndUpdate(id, req.body, { new: true});
        res.status(200).json(sign);

    } catch (err) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const sign = await Sign.findByIdAndDelete(id);
        res.status(201).json(sign);
    } catch (err) {
        res.status(400).json({error: error.message});
    }
});


export default router