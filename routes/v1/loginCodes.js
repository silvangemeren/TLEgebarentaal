import express from "express";
import User from "../../Models/User.js";
import LoginCode from "../../Models/LoginCode.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const loginCodes = await LoginCode.find()

        res.status(200).json(
            {
                "items": loginCodes,
                "_links": {
                    "self": {
                        "href": `${process.env.BASE_URL}/logincodes`
                    },
                    "collection": {
                        "href": `${process.env.BASE_URL}`
                    }
                }
            })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    if (req.body.method === "DELETE_ALL") {
        try {
            await LoginCode.deleteMany({});
            res.status(200).json({ message: 'alles is verwijderd' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        if (req.body.method === "RANDOM") {
            try {
                const newCode = await LoginCode.create({ loginCode: Math.random().toString(36).substring(2, 6).toUpperCase() });
                res.status(201).json({ newCode });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        } else {
            try {
                const newCode = await LoginCode.create(req.body);
                res.status(201).json({ message: "Logincode succesvol toegevoegd", data: newCode });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
    }
})

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    res.status(204).send();
})

export default router