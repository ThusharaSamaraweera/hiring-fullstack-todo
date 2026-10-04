import { Router } from "express";
import todoRoutes from "@/routes/todoRoutes.js";

const apiRouter = Router();

apiRouter.use("/todos", todoRoutes);

export { apiRouter };
