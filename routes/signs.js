import express from "express";
import Sign from "../Models/Sign.js";
import fs from 'fs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {

        let { page = 1, limit } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const signs = await Sign.find()
            .skip((page - 1) * limit)
            .limit(limit).collation({ locale: 'nl', strength: 2 }).sort({ lesson: 1 });
        const totalSigns = await Sign.countDocuments();
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
                "pagination": {
                    currentPage: page,
                    currentItems: limit,
                    totalPages: Math.ceil(totalSigns / limit),
                    totalItems: totalSigns,
                    _links: {
                        first: {
                            page: 1,
                            href: `${process.env.BASE_URL}/signs?page=1&limit=${limit}`
                        },
                        last: {
                            page: Math.ceil(totalSigns / limit),
                            href: `${process.env.BASE_URL}/signs?page=${Math.ceil(totalSigns / limit)}&limit=${limit}`
                        },
                        previous: page > 1 ? {
                            page: page - 1,
                            href: `${process.env.BASE_URL}/signs?page=${page - 1}&limit=${limit}`
                        } : null,
                        next: (page * limit < totalSigns) ? {
                            page: page + 1,
                            href: `${process.env.BASE_URL}/signs?page=${page + 1}&limit=${limit}`
                        } : null
                    }
                }
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

            const signSeeder = JSON.parse(fs.readFileSync('./Data/signSeeder.json', 'utf8'));
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
        try {
            const newSign = await Sign.create(req.body);
            res.status(201).json({ message: "Gebaar succesvol toegevoegd", data: newSign });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
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
        const { id } = req.params;
        const sign = await Sign.findById(id);
        res.status(200).json(sign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sign = await Sign.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(sign);

    } catch (err) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sign = await Sign.findByIdAndDelete(id);
        res.status(201).json(sign);
    } catch (err) {
        res.status(400).json({ error: error.message });
    }
});


export default router