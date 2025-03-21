import { MongoClient } from 'mongodb'

const uri = "mongodb://localhost:27017"; // Pas dit aan als je MongoDB Atlas gebruikt
const client = new MongoClient(uri);

async function removeOldIndex() {
    try {
        await client.connect();
        console.log("✅ Verbonden met MongoDB");

        const db = client.db('signs'); // Vervang 'signs' door je databasenaam
        const collection = db.collection('users');

        // Controleer bestaande indexen
        const indexes = await collection.indexes();
        console.log("🔍 Huidige indexen:", indexes);

        // Verwijder de oude 'username' index als deze bestaat
        const hasOldIndex = indexes.some(index => index.name === 'username_1');
        if (hasOldIndex) {
            await collection.dropIndex('username_1');
            console.log("🗑️ Oude index 'username_1' verwijderd.");
        } else {
            console.log("✅ Geen oude 'username_1'-index gevonden.");
        }

    } catch (error) {
        console.error('❌ Fout bij verwijderen van index:', error);
    } finally {
        await client.close();
        console.log("🔌 Verbinding gesloten.");
    }
}

removeOldIndex();
