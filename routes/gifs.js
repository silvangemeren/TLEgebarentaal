import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/:file', async (req, res) => {
    try {
        const gif = req.params.file;
        const gifPath = path.join(__dirname, '../Gebarengifs', gif);
        res.sendFile(gifPath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:map/:file', async (req, res) => {
    try {
        const gif = req.params.file;
        const map = req.params.map;

        const gifPath = path.join(__dirname, `../Gebarengifs/${map}`, gif);
        res.sendFile(gifPath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
