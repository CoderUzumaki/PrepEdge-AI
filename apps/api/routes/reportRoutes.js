import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import * as reportController from "../controllers/reportController.js";

const router = express.Router();
router.use(firebaseAuthMiddleware);
router.get("/", reportController.listReports);
router.get("/:interviewId", reportController.getReport);
export default router;
