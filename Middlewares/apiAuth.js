import ApiKey from "../Models/ApiKey.js";

// Middleware om een geldige API-key te controleren
const validateApiKey = async (req, res, next) => {

    // Als de gebruiker is ingelogd als admin of teacher, sla API-key validatie over
    if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher' || req.user.role === 'student')) {
        return next();
    }

    const apiKey = req.header('x-api-key'); // Haal de API-key op uit de request headers

    if (!apiKey) {
        return res.status(401).json({ error: "API key is required" }); // Geen API-key meegeleverd
    }

    try {
        // Controleer de API-key in de database
        const validKey = await ApiKey.findOne({ key: apiKey });

        if (!validKey) {
            return res.status(403).json({ error: "Invalid API key" }); // Ongeldige API-key
        }

        // API-key is geldig, ga door met de request
        req.apiKey = validKey; // Bewaar relevante informatie voor verdere verwerking
        next();
    } catch (err) {
        res.status(500).json({ error: "Failed to validate API key", details: err.message }); // Fout bij validatie
    }
};

export default validateApiKey;