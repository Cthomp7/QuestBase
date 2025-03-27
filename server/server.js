import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import cors from "cors";
import https from "https"; // Import https for serving via SSL

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appDirectory = path.join(__dirname, 'dist');

const app = express();
const PORT = 3001; // Your API backend port

// Enable CORS
app.use(cors());

// Serve static files from the "dist" folder
app.use(express.static(appDirectory));

// Read directory recursively (same as before)
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

// API to get codex
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

// API to get content of markdown file
app.get("/api/codex/content", (req, res) => {
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
});

const certPath = '/etc/letsencrypt/live/questbase.net/';

const privateKey = fs.readFileSync(path.join(certPath, 'privkey.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(certPath, 'cert.pem'), 'utf8');
const ca = fs.readFileSync(path.join(certPath, 'chain.pem'), 'utf8');

// Credentials for HTTPS
const credentials = { key: privateKey, cert: certificate, ca: ca };

// Create an HTTPS server and start it (port 443)
https.createServer(credentials, app).listen(443, () => {
  console.log("HTTPS server running on port 443");
});

// Also listen on HTTP (port 80) for redirect to HTTPS (optional)
app.listen(80, () => {
  console.log("HTTP server running on port 80");
});

// Explicitly listen on your API port (3001)
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
