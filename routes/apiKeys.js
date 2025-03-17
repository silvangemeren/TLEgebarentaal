import express from 'express';
import ApiKey from '../Models/ApiKey.js';
import crypto from 'crypto';
import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Endpoint voor het aanmaken van een API-key
// Endpoint voor het aanmaken van een API-key (alleen admin)
router.post('/', isAdmin, async (req, res) => {
    try {
        const { website } = req.body;

        if (!website) {
            return res.status(400).json({ error: 'Website is required' });
        }

        // API-key genereren
        const key = crypto.randomBytes(32).toString('hex');

        // Nieuwe API-key opslaan in database
        const apiKey = new ApiKey({ key, website });
        await apiKey.save();

        res.status(201).json(apiKey);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create API key', details: err.message });
    }
});

// Optioneel: Een lijst met alle API-keys ophalen (alleen voor admins bijvoorbeeld)
router.get('/', isAdmin, async (req, res) => {
    try {
        const apiKeys = await ApiKey.find();
        res.json(apiKeys);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch API keys', details: err.message });
    }
});

export default router;