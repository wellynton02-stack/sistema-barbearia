import { Router } from "express";
import { createUserController } from "../controllers/userController";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createUserController
);

export default userRoutes;
