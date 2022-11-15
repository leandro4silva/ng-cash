import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const transactionController = new TransactionController();

const transactionRoutes = Router();

transactionRoutes.post("/", ensureAuthenticated, transactionController.create);
transactionRoutes.get("/", ensureAuthenticated, transactionController.index);

export {
	transactionRoutes
};