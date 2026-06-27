import { app } from './app';
import { config } from './config';
import { logger } from './config/logger.config';
import { initRedis, redis } from './config/redis.config';
import { prisma } from './database/prisma';

async function bootstrap() {
  await initRedis();

  const server = app.listen(config.PORT, () => {
    logger.info(`🚀 ${config.APP_NAME} running on port ${config.PORT} [${config.NODE_ENV}]`);
    logger.info(`👉 API Endpoint: http://localhost:${config.PORT}/api/${config.API_VERSION}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      if (redis.isOpen) {
        await redis.quit();
      }
      logger.info('Server closed successfully.');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after 10s timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', { error: err.message, stack: err.stack });
  process.exit(1);
});
