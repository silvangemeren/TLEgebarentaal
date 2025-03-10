    import express from "express";
    import Sign from "../Models/Sign.js";
    import { randomUUID } from 'crypto';  // Gebruik crypto module voor UUID

    const router = express.Router();

    // Zorg dat je JSON requests kunt verwerken
    router.use(express.json());

    // (Optioneel) Basisroute voor testdoeleinden
    router.get('/', (req, res) => {
        res.send('Playlist router draait. Gebruik POST, GET, etc. via deze router.');
    });

    let playlists = [];

    // Maak een nieuwe playlist
    router.post('/', (req, res) => {
        const { playlist_naam } = req.body;
        if (!playlist_naam) {
            return res.status(400).json({ error: 'playlist_naam is verplicht' });
        }

        // Gebruik randomUUID voor het genereren van een UUID
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
        res.json(playlists);
    });

    // Voeg een gebaar toe aan een playlist
    router.post('/:playlist_id/add-gebaar', async (req, res) => {
        const { playlist_id } = req.params;
        const { id } = req.body;

        // Controleer of het id correct wordt meegegeven in de request body
        console.log('Request body:', req.body);  // Dit helpt bij het debuggen

        const playlist = playlists.find(p => p.id === playlist_id);
        if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

        try {
            // Zoek naar het gebaar in de database door gebruik te maken van _id (MongoDB gebruikt dit standaard)
            const gebaar = await Sign.findOne({ _id: id });

            if (!gebaar) return res.status(404).json({ error: "Gebaar niet gevonden" });

            // Voorkom dubbele toevoeging
            if (playlist.gebaren.some(g => g.id === id)) {
                return res.status(400).json({ error: "Gebaar is al toegevoegd aan de playlist" });
            }

            // Voeg het gebaar toe aan de playlist
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

    // Exporteer de router, zodat deze in de hoofdserver kan worden gebruikt
    export default router;
