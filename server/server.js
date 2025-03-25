import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3001; // Make sure this port is different from Vite's default (5173)

app.use(cors()); // Allow Vite frontend to fetch from this API

function readDirectoryRecursively(dirPath) {
  const entries = fs.readdirSync(dirPath);
  return entries
    .map((entry) => {
      const fullPath = path.join(dirPath, entry);
      const stats = fs.statSync(fullPath);
      const relativePath = path.relative(
        path.join(process.cwd(), "src/pages/codex/data"),
        fullPath
      );

      if (stats.isDirectory()) {
        return {
          name: entry,
          path: `/codex/${relativePath}`,
          type: "folder",
          children: readDirectoryRecursively(fullPath),
        };
      } else if (entry.endsWith(".md")) {
        return {
          name: entry.replace(".md", ""),
          path: `/codex/${relativePath}`,
          type: ".md",
        };
      }
      return null;
    })
    .filter(Boolean);
}

app.get("/api/codex", (req, res) => {
  const codexPath = path.join(process.cwd(), "src/pages/codex/data");
  try {
    const codexEntries = readDirectoryRecursively(codexPath);
    res.json(codexEntries);
  } catch (error) {
    console.error("Error reading codex directory:", error);
    res.status(500).json([]);
  }
});

app.get("/api/codex/content", (req, res) => {
  try {
    const { path: requestedPath } = req.query;

    if (!requestedPath || typeof requestedPath !== "string") {
      return res.status(400).json({ message: "Path parameter is required" });
    }

    // Remove the /codex/ prefix if it exists
    const cleanPath = requestedPath.replace(/^\/codex\//, "");

    // Construct the full path to the markdown file
    const fullPath = path.join(
      process.cwd(),
      "src/pages/codex/data",
      cleanPath
    );

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Read the markdown file
    const content = fs.readFileSync(fullPath, "utf-8");
    res.send(content);
  } catch (error) {
    console.error("Error reading markdown file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
