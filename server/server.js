import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import https from "https"; // Import https for serving via SSL
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import codexRoutes from "./routes/codexRoutes.js";
import infoRoutes from "./routes/infoRoutes.js";

// Load environment variables
const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";

// Load the appropriate .env file
try {
  dotenv.config({ path: envFile });
  console.log(`Loaded environment from ${envFile}`);
} catch (error) {
  console.warn(
    `Warning: Could not load ${envFile}, using default environment: ${error}`
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appDirectory = path.join(__dirname, "..", "dist");

const app = express();
const PORT = process.env.PORT || 3001; // Use PORT from env or default to 3001

// Enable CORS
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", codexRoutes);
app.use("/api", infoRoutes);

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
