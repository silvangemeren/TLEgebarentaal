const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Sign = require('../Models/Sign'); // Zorg dat het pad klopt

const router = express.Router();

// Zorg dat je JSON requests kunt verwerken
router.use(express.json());

// (Optioneel) Basisroute voor testdoeleinden
router.get('/', (req, res) => {
    res.send('Playlist router draait. Gebruik POST, GET, etc. via deze router.');
});

let playlists = [];

// Maak een nieuwe playlist
// Omdat je deze router mount op '/playlists', wordt dit endpoint beschikbaar als POST /playlists
router.post('/', (req, res) => {
    const { playlist_naam } = req.body;
    if (!playlist_naam) {
        return res.status(400).json({ error: 'playlist_naam is verplicht' });
    }

    const playlist_id = uuidv4();
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
    res.json(playlists);
});

// Voeg een gebaar toe aan een playlist
// Dit wordt beschikbaar als POST /playlists/:playlist_id/add-gebaar
router.post('/:playlist_id/add-gebaar', async (req, res) => {
    const { playlist_id } = req.params;
    const { gebaar_id } = req.body;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    try {
        // Zoek in de database naar het gebaar met het meegegeven id
        const gebaar = await Sign.findOne({ id: gebaar_id });
        if (!gebaar) return res.status(404).json({ error: "Gebaar niet gevonden" });

        // Voorkom dubbele toevoeging
        if (playlist.gebaren.some(g => g.id === gebaar_id)) {
            return res.status(400).json({ error: "Gebaar is al toegevoegd aan de playlist" });
        }

        playlist.gebaren.push(gebaar);
        console.log(`Gebaar '${gebaar_id}' toegevoegd aan playlist ${playlist_id}`);
        res.status(200).json({ message: `Gebaar ${gebaar_id} toegevoegd aan playlist` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Haal gebaren op uit een specifieke playlist
// Dit wordt beschikbaar als GET /playlists/:playlist_id
router.get('/:playlist_id', (req, res) => {
    const { playlist_id } = req.params;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    res.json(playlist.gebaren);
});

// Verwijder een gebaar uit een playlist
// Dit wordt beschikbaar als DELETE /playlists/:playlist_id/remove-gebaar
router.delete('/:playlist_id/remove-gebaar', (req, res) => {
    const { playlist_id } = req.params;
    const { gebaar_id } = req.body;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    const initialCount = playlist.gebaren.length;
    playlist.gebaren = playlist.gebaren.filter(g => g.id !== gebaar_id);

    if (playlist.gebaren.length === initialCount) {
        return res.status(404).json({ error: "Gebaar niet gevonden in de playlist" });
    }

    console.log(`Gebaar '${gebaar_id}' verwijderd uit playlist ${playlist_id}`);
    res.status(200).json({ message: `Gebaar ${gebaar_id} verwijderd uit playlist` });
});

// Exporteer de router, zodat deze in de hoofdserver kan worden gebruikt
module.exports = router;
