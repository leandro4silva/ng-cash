import { Router } from "express";
import { AccountsController } from "../controllers/AccountsController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const accountsController = new AccountsController();
const accountRoutes = Router();

accountRoutes.get("/", ensureAuthenticated, accountsController.show);

export {
	accountRoutes
};