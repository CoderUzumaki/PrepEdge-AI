import express from "express";
import { updateUserSchema } from "@prepedge/shared";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import { validate } from "../middleware/validate.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();
router.use(firebaseAuthMiddleware);
router.get("/me", userController.getMe);
router.get("/me/quotas", userController.getMyQuotas);
router.patch("/me", validate(updateUserSchema), userController.updateMe);
export default router;
