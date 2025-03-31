import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import https from "https"; // Import https for serving via SSL
import dotenv from "dotenv";

// Load environment variables
const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";

// Load the appropriate .env file
try {
  dotenv.config({ path: envFile });
  console.log(`Loaded environment from ${envFile}`);
} catch (error) {
  console.warn(`Warning: Could not load ${envFile}, using default environment`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appDirectory = path.join(__dirname, "..", "dist");

console.log("Environment:", process.env.NODE_ENV);
console.log("Is Production:", isProduction);

const app = express();
const PORT = process.env.PORT || 3001; // Use PORT from env or default to 3001

// Enable CORS
app.use(cors());

// Read directory recursively (same as before)
function readDirectoryRecursively(dir, dirPath) {
  const entries = fs.readdirSync(dirPath);
  return entries
    .map((entry) => {
      const fullPath = path.join(dirPath, entry);
      const stats = fs.statSync(fullPath);
      const relativePath = path.relative(
        path.join(process.cwd(), `src/pages/${dir}/data`),
        fullPath
      );

      if (stats.isDirectory()) {
        return {
          name: entry,
          path: `/${dir}/${relativePath}`,
          type: "folder",
          children: readDirectoryRecursively(dir, fullPath),
        };
      } else if (entry.endsWith(".md")) {
        return {
          name: entry.replace(".md", ""),
          path: `/${dir}/${relativePath}`,
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
    const codexEntries = readDirectoryRecursively("codex", codexPath);
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

// API to get codex
app.get("/api/npcs", (req, res) => {
  const npcPath = path.join(process.cwd(), "src/pages/npcs/data");
  try {
    const npcEntries = readDirectoryRecursively("npcs", npcPath);
    res.json(npcEntries);
  } catch (error) {
    console.error("Error reading codex directory:", error);
    res.status(500).json([]);
  }
});

// API to get content of markdown file
app.get("/api/npcs/content", (req, res) => {
  try {
    const { path: requestedPath } = req.query;

    if (!requestedPath || typeof requestedPath !== "string") {
      return res.status(400).json({ message: "Path parameter is required" });
    }

    const cleanPath = requestedPath.replace(/^\/npcs\//, "");
    const fullPath = path.join(
      process.cwd(),
      "src/pages/npcs/data",
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


// Serve static files from the "dist" folder
app.use(express.static(appDirectory));

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

if (isProduction) {
  // Production setup with HTTPS
  const certPath = "/etc/letsencrypt/live/questbase.net/";
  const privateKey = fs.readFileSync(
    path.join(certPath, "privkey.pem"),
    "utf8"
  );
  const certificate = fs.readFileSync(path.join(certPath, "cert.pem"), "utf8");
  const ca = fs.readFileSync(path.join(certPath, "chain.pem"), "utf8");

  // Credentials for HTTPS
  const credentials = { key: privateKey, cert: certificate, ca: ca };

  // Redirect HTTP to HTTPS
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(["https://", req.get("Host"), req.url].join(""));
    }
    next();
  });

  // Create an HTTPS server and start it (port 443)
  https.createServer(credentials, app).listen(443, () => {
    console.log("HTTPS server running on port 443");
  });

  // Also listen on HTTP (port 80) for redirect to HTTPS
  app.listen(80, () => {
    console.log("HTTP server running on port 80");
  });
} else {
  // Development setup - simple HTTP server
  app.listen(PORT, () => {
    console.log(`Development server running on http://localhost:${PORT}`);
  });
}
