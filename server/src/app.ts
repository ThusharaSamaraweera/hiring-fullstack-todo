import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import { env } from "@/config/env.js";
import { errorHandler, notFoundHandler, requestLogger } from "@/middleware/index.js";
import { apiRouter } from "@/routes/index.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(requestLogger);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
