import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/:file', async (req, res) => {
    try {
        const video = req.params.file;
        const videoPath = path.join(__dirname, '../Gebarenvideos', video);
        res.sendFile(videoPath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
