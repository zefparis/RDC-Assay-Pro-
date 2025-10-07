import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'info', 'warn'] : ['error'],
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Params: ${e.params}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e: any) => {
  logger.error('Database error:', e);
});

prisma.$on('info', (e: any) => {
  logger.info(`Database info: ${e.message}`);
});

prisma.$on('warn', (e: any) => {
  logger.warn(`Database warning: ${e.message}`);
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Test database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('📴 Database disconnected successfully');
  } catch (error) {
    logger.error('❌ Database disconnection failed:', error);
  }
};
