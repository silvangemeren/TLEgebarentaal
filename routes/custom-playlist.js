import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

let playlists = [];

let gebaren = {
    "Adres": {
        "id": "Adres",
        "translation": "Adres",
        "video": "/video/Adres.mp4",
        "gif": "/gifs/Adres.gif",
        "lesson": 5,
        "explanation": "De locatie waar iemand woont of waar iets zich bevindt."
    },
    "Dank je": {
        "id": "Dank je",
        "translation": "Dank je",
        "video": "/video/Dank_je.mp4",
        "gif": "/gifs/Dank_je.gif",
        "lesson": 2,
        "explanation": "Een manier om iemand te bedanken."
    }
};

// Maak een nieuwe playlist
app.post('/playlists', (req, res) => {
    const { playlist_naam } = req.body;

    const playlist_id = uuidv4();
    const newPlaylist = {
        id: playlist_id,
        naam: playlist_naam,
        gebaren: []
    };

    playlists.push(newPlaylist);
    res.status(201).json(newPlaylist);
});

// Haal alle playlists op
app.get('/playlists', (req, res) => {
    res.json(playlists);
});

// Voeg een gebaar toe aan een playlist
app.post('/playlists/:playlist_id/add-gebaar', (req, res) => {
    const { playlist_id } = req.params;
    const { gebaar_id } = req.body;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    const gebaar = gebaren[gebaar_id];
    if (!gebaar) return res.status(404).json({ error: "Gebaar niet gevonden" });

    playlist.gebaren.push(gebaar);
    res.status(200).json({ message: `Gebaar ${gebaar_id} toegevoegd aan playlist` });
});

// Haal gebaren op uit een specifieke playlist
app.get('/playlists/:playlist_id', (req, res) => {
    const { playlist_id } = req.params;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    res.json(playlist.gebaren);
});

// Verwijder een gebaar uit een playlist
app.delete('/playlists/:playlist_id/remove-gebaar', (req, res) => {
    const { playlist_id } = req.params;
    const { gebaar_id } = req.body;

    const playlist = playlists.find(p => p.id === playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist niet gevonden" });

    playlist.gebaren = playlist.gebaren.filter(g => g.id !== gebaar_id);
    res.status(200).json({ message: `Gebaar ${gebaar_id} verwijderd uit playlist` });
});

// Start de server
app.listen(8000, () => {
    console.log('Server draait op poort 8000');
});
