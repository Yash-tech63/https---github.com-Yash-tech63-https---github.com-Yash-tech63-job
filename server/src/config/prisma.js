let prisma = null;

try {
  const { PrismaClient } = require('@prisma/client');
  if (process.env.DATABASE_URL) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
} catch (err) {
  // Prisma client gracefully handles environments running pure MongoDB or pending generation
}

module.exports = prisma;
