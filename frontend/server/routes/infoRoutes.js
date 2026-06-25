import express from "express";
import * as infoController from "../controllers/infoControllers.js";

const router = express.Router();

router.post("/api/upcoming", infoController.addUpcomingDate);
router.delete("/api/upcoming", infoController.deleteUpcomingDate);

export default router;
