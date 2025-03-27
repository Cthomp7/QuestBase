import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import https from "https"; // Import https for serving via SSL
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appDirectory = path.join(__dirname, "..", "dist");

console.log("__dirname:", __dirname);
console.log("appDirectory:", appDirectory);

const app = express();
const PORT = process.env.PORT || 3001; // Use PORT from env or default to 3001
const isProduction = process.env.NODE_ENV === "production";

// Enable CORS
app.use(cors());

// Serve static files from the "dist" folder
app.use(express.static(appDirectory));

app.use("/api", (req, res) => {
  const requestedPath = req.url;
  // Check if the path starts with /api, then call your existing API handler
  if (requestedPath.startsWith("/api")) {
    app.handle(req, res); // Forward the request to the relevant API handlers
  } else {
    // Handle non-API requests
    res.status(404).send("Not found");
  }
});

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
