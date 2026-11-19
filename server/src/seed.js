const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { connectDB, disconnectDB } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('[Seed] Database initialization finished.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Database initialization error:', err);
    process.exit(1);
  }
};

run();
