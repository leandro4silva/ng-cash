import { Router } from "express";
import { userRoutes } from "./users.routes";
import { sessionRoutes } from "./sessions.routes";
import { accountRoutes } from "./accounts.routes";
import { transactionRoutes } from "./transactions.routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionRoutes);
routes.use("/accounts", accountRoutes);
routes.use("/transactions", transactionRoutes);

export {
	routes
};