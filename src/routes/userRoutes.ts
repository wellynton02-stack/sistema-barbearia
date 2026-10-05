import { Router } from "express";
import { createUserController } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/", createUserController);

export default userRoutes;
