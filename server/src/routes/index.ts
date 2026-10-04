import { Router } from "express";
import todoRoutes from "./todoRoutes.js";

const apiRouter = Router();

apiRouter.use("/todos", todoRoutes);

export { apiRouter };
