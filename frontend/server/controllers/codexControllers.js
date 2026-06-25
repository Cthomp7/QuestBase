import fs from "fs";
import path from "path";
import { readDirectoryRecursively } from "../utils/fileUtils.js";

export function requestCodex(req, res) {
  const codexPath = path.join(process.cwd(), "src/pages/codex/data");
  try {
    const codexEntries = readDirectoryRecursively("codex", codexPath);
    res.json(codexEntries);
  } catch (error) {
    console.error("Error reading codex directory:", error);
    res.status(500).json([]);
  }
}

export function requestCodexContent(req, res) {
  try {
    const { path: requestedPath } = req.query;

    if (!requestedPath || typeof requestedPath !== "string") {
      return res.status(400).json({ message: "Path parameter is required" });
    }

    const cleanPath = requestedPath.replace(/^\/codex\//, "");
    const fullPath = path.join(
      process.cwd(),
      "src/pages/codex/data",
      cleanPath
    );

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    res.send(content);
  } catch (error) {
    console.error("Error reading markdown file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export function requestNPCs(req, res) {
  const npcPath = path.join(process.cwd(), "src/pages/npcs/data");
  try {
    const npcEntries = readDirectoryRecursively("npcs", npcPath);
    res.json(npcEntries);
  } catch (error) {
    console.error("Error reading codex directory:", error);
    res.status(500).json([]);
  }
}

export function requestNPCsContent(req, res) {
  try {
    const { path: requestedPath } = req.query;

    if (!requestedPath || typeof requestedPath !== "string") {
      return res.status(400).json({ message: "Path parameter is required" });
    }

    const cleanPath = requestedPath.replace(/^\/npcs\//, "");
    const fullPath = path.join(process.cwd(), "src/pages/npcs/data", cleanPath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    res.send(content);
  } catch (error) {
    console.error("Error reading markdown file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
