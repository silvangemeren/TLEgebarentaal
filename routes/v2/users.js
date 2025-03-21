import express from "express";
import User from "../../Models/User.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let { page = 1, limit } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const users = await User.find()
            .skip((page - 1) * limit)
            .limit(limit).collation({ locale: 'nl', strength: 2 }).sort({ lesson: 1 });
        const totalUsers = await User.countDocuments();
        res.status(200).json(
            {
                "items": users,
                "_links": {
                    "self": {
                        "href": `${process.env.BASE_URL}/users`
                    },
                    "collection": {
                        "href": `${process.env.BASE_URL}`
                    }
                },
                "pagination": {
                    currentPage: page,
                    currentItems: limit,
                    totalPages: Math.ceil(totalUsers / limit),
                    totalItems: totalUsers,
                    _links: {
                        first: {
                            page: 1,
                            href: `${process.env.BASE_URL}/users?page=1&limit=${limit}`
                        },
                        last: {
                            page: Math.ceil(totalUsers / limit),
                            href: `${process.env.BASE_URL}/users?page=${Math.ceil(totalUsers / limit)}&limit=${limit}`
                        },
                        previous: page > 1 ? {
                            page: page - 1,
                            href: `${process.env.BASE_URL}/users?page=${page - 1}&limit=${limit}`
                        } : null,
                        next: (page * limit < totalUsers) ? {
                            page: page + 1,
                            href: `${process.env.BASE_URL}/users?page=${page + 1}&limit=${limit}`
                        } : null
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
            await User.deleteMany({});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        try {
            const newUser = await User.create(req.body);
            res.status(201).json({ message: "Gebruiker succesvol toegevoegd", data: newUser });
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
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router