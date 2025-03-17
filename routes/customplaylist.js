import express from "express";
import Sign from "../Models/Sign.js";
import { randomUUID } from 'crypto';

const router = express.Router();

router.use(express.json());

// Zorg dat er een playlists-array is (indien nog niet gedeclareerd)
let playlists = [];

// Maak een nieuwe playlist (open endpoint)
router.post('/', (req, res) => {
    const { playlist_naam } = req.body;
    if (!playlist_naam) {
        return res.status(400).json({ error: 'playlist_naam is verplicht' });
    }

    const playlist_id = randomUUID();
    const newPlaylist = {
        id: playlist_id,
        naam: playlist_naam,
        gebaren: []
    };

    playlists.push(newPlaylist);
    console.log(`Nieuwe playlist aangemaakt: ${JSON.stringify(newPlaylist)}`);
    res.status(201).json(newPlaylist);
});

// Haal alle playlists op
router.get('/', (req, res) => {
    const playlistNamen = playlists.map(p => p.naam);
    res.json(playlistNamen);
});


// Voeg een gebaar toe aan een playlist
router.post('/:playlist_id/add-gebaar', async (req, res) => {
    const { playlist_id } = req.params;
    const { id } = req.body;

    console.log('Request body:', req.body);

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    try {
        const gebaar = await Sign.findOne({ _id: id });

        if (!gebaar) return res.status(404).json({ error: "Gebaar niet gevonden" });

        if (playlist.gebaren.some(g => g.id === id)) {
            return res.status(400).json({ error: "Gebaar is al toegevoegd aan de playlist" });
        }

        playlist.gebaren.push(gebaar);
        console.log(`Gebaar '${id}' toegevoegd aan playlist ${playlist_id}`);
        res.status(200).json({ message: `Gebaar ${id} toegevoegd aan playlist` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Haal gebaren op uit een specifieke playlist
router.get('/:playlist_id', (req, res) => {
    const { playlist_id } = req.params;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    res.json(playlist.gebaren);
});

// Verwijder een gebaar uit een playlist
router.delete('/:playlist_id/remove-gebaar', (req, res) => {
    const { playlist_id } = req.params;
    const { id } = req.body;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    const initialCount = playlist.gebaren.length;
    playlist.gebaren = playlist.gebaren.filter(g => g.id !== id);

    if (playlist.gebaren.length === initialCount) {
        return res.status(404).json({ error: "Gebaar niet gevonden in de playlist" });
    }

    console.log(`Gebaar '${id}' verwijderd uit playlist ${playlist_id}`);
    res.status(200).json({ message: `Gebaar ${id} verwijderd uit playlist` });
});

export default router;
