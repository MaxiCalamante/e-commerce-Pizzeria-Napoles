const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;
        
        // If no MONGO_URI is provided, start the memory server
        if (!uri || uri.includes('127.0.0.1')) {
            mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            console.log('MongoDB Memory Server Started at', uri);
        }

        await mongoose.connect(uri);
        console.log('MongoDB Conectado exitosamente');
        
        return uri; // Return uri so we can configure connect-mongo
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
