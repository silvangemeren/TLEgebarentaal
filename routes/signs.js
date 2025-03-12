import express from "express";
import Sign from "../Models/Sign.js";
import fs from 'fs';
import { getFilteredSigns } from "./filter.js"; // Zorg dat het pad klopt
import { authenticateUser, isAdminOrTeacher } from "../middlewares/auth.js"; // Voeg deze import toe

const router = express.Router();

// Zorg dat de /filtered route als eerste staat zodat deze niet door /:id wordt onderschept
router.get('/filtered', async (req, res) => {
    try {
        const { page, limit } = req.query;
        const data = await getFilteredSigns(req.query, page, limit);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        let { page = 1, limit } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const signs = await Sign.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .collation({ locale: 'nl', strength: 2 })
            .sort({ lesson: 1, translation: 1 });
        const totalSigns = await Sign.countDocuments();
        res.status(200).json({
            "items": signs,
            "_links": {
                "self": { "href": `${process.env.BASE_URL}/signs` },
                "collection": { "href": `${process.env.BASE_URL}` }
            },
            "pagination": {
                currentPage: page,
                currentItems: limit,
                totalPages: Math.ceil(totalSigns / limit),
                totalItems: totalSigns,
                _links: {
                    first: { page: 1, href: `${process.env.BASE_URL}/signs?page=1&limit=${limit}` },
                    last: { page: Math.ceil(totalSigns / limit), href: `${process.env.BASE_URL}/signs?page=${Math.ceil(totalSigns / limit)}&limit=${limit}` },
                    previous: page > 1 ? { page: page - 1, href: `${process.env.BASE_URL}/signs?page=${page - 1}&limit=${limit}` } : null,
                    next: (page * limit < totalSigns) ? { page: page + 1, href: `${process.env.BASE_URL}/signs?page=${page + 1}&limit=${limit}` } : null
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Let op: Plaats de /:id route onder de specifieke routes, zoals /filtered
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sign = await Sign.findById(id);
        res.status(200).json(sign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// De volgende routes (POST, PUT, DELETE) worden beschermd met authenticateUser en isAdminOrTeacher

// POST: Alleen teacher en admin mogen een nieuw gebaar toevoegen
router.post('/', authenticateUser, isAdminOrTeacher, async (req, res) => {
    if (req.body.method === "SEED") {
        try {
            let amount = req.body.amount;
            const reset = req.body.reset;
            if (reset) {
                await Sign.deleteMany({});
            }

            const signSeeder = JSON.parse(fs.readFileSync('./Data/signSeeder.json', 'utf8'));
            const seederSigns = signSeeder.map(sign => ({
                ...sign,
                video: `${process.env.BASE_URL}${sign.video}`,
                gif: `${process.env.BASE_URL}${sign.gif}`
            }));

            for (let i = 0; i < amount; i++) {
                if (i > seederSigns.length - 1) {
                    amount = seederSigns.length;
                } else {
                    await Sign.create(seederSigns[i]);
                }
            }
            res.status(200).json({ message: `Er staan nu ${amount} gebaren in de database en de database is ${reset ? '' : 'niet '}gereset.` });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        try {
            const newSign = await Sign.create(req.body);
            res.status(201).json({ message: "Gebaar succesvol toegevoegd", data: newSign });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
});

// PUT: Alleen teacher en admin mogen een bestaand gebaar updaten
router.put('/:id', authenticateUser, isAdminOrTeacher, async (req, res) => {
    try {
        const { id } = req.params;
        const sign = await Sign.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(sign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Alleen teacher en admin mogen een gebaar verwijderen
router.delete('/:id', authenticateUser, isAdminOrTeacher, async (req, res) => {
    try {
        const { id } = req.params;
        const sign = await Sign.findByIdAndDelete(id);
        res.status(201).json(sign);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS']);
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS, DELETE']);
    res.status(204).send();
});

export default router;
