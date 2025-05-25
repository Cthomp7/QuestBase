import express from "express";
import * as codexController from "../controllers/codexControllers.js";

const router = express.Router();

router.get("/codex", codexController.requestCodex);
router.get("/codex/content", codexController.requestCodexContent);
router.get("/npcs", codexController.requestNPCs);
router.get("/npcs/content", codexController.requestNPCsContent);

export default router;
