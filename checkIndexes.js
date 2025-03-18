import { MongoClient } from 'mongodb';

// Verbind met je MongoDB-database
async function checkIndexes() {
    const uri = 'mongodb://localhost:27017'; // Pas dit aan als jouw database op een andere poort draait
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const db = client.db('signs'); // Vervang 'signs' door de naam van jouw database
        const indexes = await db.collection('users').indexes();

        console.log('Indexen in de "users" collectie:', indexes);
    } catch (err) {
        console.error('Fout bij het ophalen van indexen:', err);
    } finally {
        await client.close();
    }
}

checkIndexes();