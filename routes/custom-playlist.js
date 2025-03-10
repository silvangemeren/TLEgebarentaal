const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Voor testdoeleinden: basisroute om te checken of de server draait
app.get('/', (req, res) => {
    res.send('Server draait. Probeer de /playlists endpoints in Postman.');
});

let playlists = [];

const gebaren = {
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
    console.log(`Gebaar '${gebaar_id}' toegevoegd aan playlist ${playlist_id}`);
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
    console.log(`Gebaar '${gebaar_id}' verwijderd uit playlist ${playlist_id}`);
    res.status(200).json({ message: `Gebaar ${gebaar_id} verwijderd uit playlist` });
});

// Start de server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
});
