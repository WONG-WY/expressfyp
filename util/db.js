const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://searschool:o8DoONyaQCz1PCcgsjmK0ICJLaTOvIdZKBkeHuSzHKv2XeNjXVvxv6z2jOvshvkUcWJImqU3JpOvACDbNYK7Mg%3D%3D@searschool.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@searschool@';

async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('searschoolDB'); // Use your database name
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };
