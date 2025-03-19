import express from "express";
import Wordgroup from "../../Models/Wordgroup.js";
import fs from 'fs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const wordgroups = await Wordgroup.find()
            .collation({ locale: 'nl', strength: 2 })
            .sort({ wordgroupNumber: 1, translation: 1 });

        res.status(200).json({
            "items": wordgroups,
            "_links": {
                "self": { "href": `${process.env.BASE_URL}/signs` },
                "collection": { "href": `${process.env.BASE_URL}` }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    if (req.body.method === "SEED") {
        try {
            let amount = req.body.amount;
            const reset = req.body.reset;
            if (reset) {
                await Wordgroup.deleteMany({});
            }

            const wordgroupSeeder = JSON.parse(fs.readFileSync('./Data/wordgroupSeeder.json', 'utf8'));

            for (let i = 0; i < amount; i++) {
                if (i > wordgroupSeeder.length - 1) {
                    amount = wordgroupSeeder.length;
                } else {
                    await Wordgroup.create(wordgroupSeeder[i]);
                }
            }
            res.status(200).json({ message: `Er staan nu ${amount} gebaren in de database en de database is ${reset ? '' : 'niet '}gereset.` });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        try {
            const newWordgroup = await Wordgroup.create(req.body);
            res.status(201).json({ message: "Gebaar succesvol toegevoegd", data: newWordgroup });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
});

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS']);
    res.status(204).send();
});

export default router;
