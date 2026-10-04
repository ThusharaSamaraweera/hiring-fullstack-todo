import { env } from "./config/env.js";
import { connectToDatabase } from "./database/dbClient/connect.js";
import { app } from "./app.js";
import { registerProcessErrorHandlers } from "./utils/index.js";

registerProcessErrorHandlers();

async function startServer(): Promise<void> {
  try {
    await connectToDatabase(env.MONGODB_URI);

    app.listen(env.PORT, () => {
      console.log(`Server listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed", error);
    process.exitCode = 1;
  }
}

void startServer();
