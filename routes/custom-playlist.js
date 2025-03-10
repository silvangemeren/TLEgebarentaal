const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Zorg dat je JSON requests kunt verwerken
router.use(express.json());

// (Optioneel) Basisroute voor testdoeleinden
router.get('/', (req, res) => {
    res.send('Playlist router draait. Gebruik POST, GET, etc. via deze router.');
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
router.post('/:playlist_id/add-gebaar', (req, res) => {
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

    playlist.gebaren = playlist.gebaren.filter(g => g.id !== gebaar_id);
    console.log(`Gebaar '${gebaar_id}' verwijderd uit playlist ${playlist_id}`);
    res.status(200).json({ message: `Gebaar ${gebaar_id} verwijderd uit playlist` });
});

// Exporteer de router, zodat deze in de hoofdserver kan worden gebruikt
module.exports = router;
