import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/:file', async (req, res) => {
    try {
        const mouth = req.params.file;
        const mouthPath = path.join(__dirname, '../Data/Mondvormen', mouth);
        res.sendFile(mouthPath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
