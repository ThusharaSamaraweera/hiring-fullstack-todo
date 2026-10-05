import { env } from "@/config/env.js";
import { connectToDatabase } from "@/database/dbClient/connect.js";
import { app } from "@/app.js";
import { logger, registerProcessErrorHandlers } from "@/utils/index.js";

registerProcessErrorHandlers();

async function startServer(): Promise<void> {
  try {
    logger.info('Starting server', { port: env.PORT });
    await connectToDatabase(env.MONGODB_URI);

    app.listen(env.PORT, () => {
      logger.info('Server listening', { url: `http://localhost:${env.PORT}` });
    });
  } catch (error) {
    logger.error('Server startup failed', { error });
    process.exitCode = 1;
  }
}

void startServer();
