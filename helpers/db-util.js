import { MongoClient } from 'mongodb';

export async function connectDatabase() {
    const client = await MongoClient
        .connect(process.env.MONGO_URI);
        return client;
}

export async function insertDocument(client, collection, document) {
    const db = client.db();
    const result = await db.collection(collection).insertOne(document);
    return result;
}

export async function getAllDocuments(client, collection , filter , sort){
    const db = client.db();
    return await db.collection(collection).find({
        ...filter
    }).sort(sort).toArray();
}