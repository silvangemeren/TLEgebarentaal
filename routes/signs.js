import express from "express";
import Sign from "../Models/Sign.js";

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

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    res.status(204).send();
})

export default router