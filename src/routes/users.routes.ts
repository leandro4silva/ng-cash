import {Router} from "express";
import { UserController } from "../controllers/UserController";

const userRoutes = Router();

const userController = new UserController();

userRoutes.post("/", userController.create);
userRoutes.get("/", userController.index);

export {userRoutes};