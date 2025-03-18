import express from "express";
import Sign from "../Models/Sign.js";
import { randomUUID } from 'crypto';

const router = express.Router();

router.use(express.json());

// Dummy authentication middleware die verwacht dat req.user is gezet.
// Vervang dit door jouw eigen authenticatiemiddel indien nodig.
function requireAuth(req, res, next) {
    if (!req.user || !req.user.email) {
        return res.status(401).json({ error: 'Niet ingelogd' });
    }
    next();
}

// Gebruik de authenticatiemiddleware voor alle routes in deze router.
router.use(requireAuth);

// Zorg dat er een playlists-array is (indien nog niet gedeclareerd)
let playlists = [];

// Maak een nieuwe playlist
router.post('/', (req, res) => {
    const { playlist_naam } = req.body;
    const userEmail = req.user.email;

    if (!playlist_naam) {
        return res.status(400).json({ error: 'playlist_naam is verplicht' });
    }

    const playlist_id = randomUUID();
    const newPlaylist = {
        id: playlist_id,
        naam: playlist_naam,
        gebaren: [],
        email: userEmail // Koppel de playlist aan het e-mailadres van de gebruiker
    };

    playlists.push(newPlaylist);
    console.log(`Nieuwe playlist aangemaakt: ${JSON.stringify(newPlaylist)}`);
    res.status(201).json(newPlaylist);
});

// Haal alle playlists op voor de ingelogde gebruiker
router.get('/', (req, res) => {
    const userEmail = req.user.email;
    const userPlaylists = playlists.filter(p => p.email === userEmail);
    const response = userPlaylists.map(p => ({
        id: p.id,
        naam: p.naam,
    }));

    res.json(response);
});

// Voeg een gebaar toe aan een playlist
router.post('/:playlist_id/add-gebaar', async (req, res) => {
    const { playlist_id } = req.params;
    const { id } = req.body;
    const userEmail = req.user.email;

    console.log('Request body:', req.body);
    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    // Controleer of de playlist van de ingelogde gebruiker is
    if (playlist.email !== userEmail) {
        return res.status(403).json({ error: "Toegang geweigerd voor deze playlist" });
    }

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
    const userEmail = req.user.email;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    if (playlist.email !== userEmail) {
        return res.status(403).json({ error: "Toegang geweigerd voor deze playlist" });
    }

    res.json({
        id: playlist.id,
        naam: playlist.naam,
        gebaren: playlist.gebaren
    });
});


// PATCH: Bewerk een playlist (bijv. verwijder een gebaar)
router.patch('/:playlist_id', (req, res) => {
    const { playlist_id } = req.params;
    const { id } = req.body;  // 'id' is de identifier van het gebaar dat verwijderd moet worden
    const userEmail = req.user.email;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    if (playlist.email !== userEmail) {
        return res.status(403).json({ error: "Toegang geweigerd voor deze playlist" });
    }

    const initialCount = playlist.gebaren.length;
    playlist.gebaren = playlist.gebaren.filter(g => g.id !== id);

    if (playlist.gebaren.length === initialCount) {
        return res.status(404).json({ error: "Gebaar niet gevonden in de playlist" });
    }

    console.log(`Gebaar '${id}' verwijderd uit playlist ${playlist_id} via PATCH`);
    res.status(200).json({ message: `Gebaar ${id} verwijderd uit playlist` });
});



// DELETE: Verwijder de hele playlist
router.delete('/:playlist_id', (req, res) => {
    const { playlist_id } = req.params;
    const userEmail = req.user.email;

    // Zoek de playlist op
    const playlistIndex = playlists.findIndex(p => p.id === playlist_id);
    if (playlistIndex === -1) {
        return res.status(404).json({ error: "Playlist niet gevonden" });
    }

    // Controleer of de playlist tot de ingelogde gebruiker behoort
    if (playlists[playlistIndex].email !== userEmail) {
        return res.status(403).json({ error: "Toegang geweigerd voor deze playlist" });
    }

    // Verwijder de playlist uit de array
    playlists.splice(playlistIndex, 1);
    console.log(`Playlist '${playlist_id}' verwijderd door gebruiker ${userEmail}`);
    res.status(200).json({ message: `Playlist ${playlist_id} succesvol verwijderd` });
});

export default router;
