import { MongoClient } from 'mongodb';

const client = new MongoClient(useRuntimeConfig().MONGO_URI);
const db = client.db('ovkuse');

export const users = db.collection('users');
export const media = db.collection('media');
export const booths = db.collection('booths');

export default defineNitroPlugin(async () => {
    await client.connect();
    console.log('Connected to MongoDB');
});
