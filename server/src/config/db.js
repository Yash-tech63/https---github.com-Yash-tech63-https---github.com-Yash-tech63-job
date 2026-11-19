const mongoose = require('mongoose');

let mongod = null;

// Default production fallback URI provided for this project
const DEFAULT_ATLAS_URI = 'mongodb+srv://samikshasingh091_db_user:8VaN41PFksY79zAg@cluster0.tbgw5pd.mongodb.net/truehire_db?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;

    if (uri && uri.trim() !== '') {
      console.log('[Database] Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000
      });
      console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    }

    // In local development only: attempt local MongoDB
    if (process.env.NODE_ENV !== 'production') {
      try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/truehire_db', {
          serverSelectionTimeoutMS: 2000
        });
        console.log(`[Database] Local MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (localErr) {
        try {
          console.log('[Database] Initializing development in-memory engine...');
          const { MongoMemoryServer } = require('mongodb-memory-server');
          mongod = await MongoMemoryServer.create();
          const memUri = mongod.getUri();
          const conn = await mongoose.connect(memUri);
          console.log(`[Database] In-Memory MongoDB Connected at: ${memUri}`);

          const { seedDatabase } = require('../utils/seedData');
          await seedDatabase();
          return conn;
        } catch (memErr) {
          console.warn('[Database] In-memory MongoDB not available, proceeding without it.');
        }
      }
    }

    throw new Error('No MongoDB connection URI available. Please configure MONGODB_URI.');
  } catch (error) {
    console.error(`[Database] Connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
