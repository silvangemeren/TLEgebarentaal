import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { authenticateUser, isAdminOrTeacher } from '../../Middlewares/auth.js';

const router = express.Router();
const aboutFile = path.join(process.cwd(), 'data', 'about.json');

// GET: Toon de inhoud van de about.json (openbaar toegankelijk)
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(aboutFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Kan About-pagina niet ophalen.' });
    }
});

// PUT: Update de about.json (alleen toegankelijk voor admin of teacher)
router.put('/', authenticateUser, isAdminOrTeacher, async (req, res) => {
    const { content } = req.body;

    try {
        await fs.writeFile(aboutFile, JSON.stringify({ content }, null, 2));
        res.json({ message: 'About pagina geüpdatet!' });
    } catch (err) {
        res.status(500).json({ error: 'Kan bestand niet updaten.' });
    }
});

export default router;
