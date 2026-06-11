import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();
router.post("/register", firebaseAuthMiddleware, authController.register);
router.post("/login", firebaseAuthMiddleware, authController.login);
export default router;
