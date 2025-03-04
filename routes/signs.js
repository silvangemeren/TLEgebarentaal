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

router.post('/', async (req, res) => {
    if (req.body.method === "SEED") {
        //seeder
        try {
            const amount = req.body.amount
            const reset = req.body.reset
            if (reset) {
                await Sign.deleteMany({})
            }

            const seederSigns = [
                {
                    "translation": "Aanwezig",
                    "video": `${process.env.BASE_URL}/videos/aanwezig.mp4`,
                    "gif": `${process.env.BASE_URL}/gifs/aanwezig.gif`,
                    "lesson": 1,
                    "explanation": "zich bevindend op de plaats of bij de gebeurtenis waarvan sprake is.",
                    "handShapesR": {
                        "shape": "hoek-nul",
                        "imageUrl": "https://ow.gebarencentrum.nl/img/39-r.5e8d9d11.png"
                    },
                    "mouthShape": {
                        "shape": "Shh",
                        "imageUrl": "https://api-ngtbeheer.gebarencentrum.nl/sign/oral/13"
                    }
                },
            ]

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

export default router