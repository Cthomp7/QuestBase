import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import https from "https"; // Import https for serving via SSL
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

console.log("Environment:", process.env.NODE_ENV);
console.log("Is Production:", isProduction);

const app = express();
const PORT = process.env.PORT || 3001; // Use PORT from env or default to 3001

// Enable CORS
app.use(cors());
app.use(express.json());

// Register
app.post("/api/register", async (req, res) => {
  const { email, password, code } = req.body;
  if (!email || !password || !code) {
    return res
      .status(400)
      .json({ message: "Email, password, and code are required" });
  }
  const usersFile = path.join(process.cwd(), "server/users.json");
  let users = [];
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, "utf-8");
      users = JSON.parse(data || "[]");
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Error reading users file: ${err}` });
  }
  // Check if code is valid (exists in any user object with a 'code' property)
  const codeUserIndex = users.findIndex((u) => u.code === code);
  if (codeUserIndex === -1) {
    return res.status(403).json({ message: "Invalid registration code" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  users[codeUserIndex].email = email;
  users[codeUserIndex].password = hashed;
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    return res.status(500).json({ message: `Error saving user: ${err}` });
  }
  res.status(201).json({ message: "User registered" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const usersFile = path.join(process.cwd(), "server/users.json");
  let users = [];
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, "utf-8");
      users = JSON.parse(data || "[]");
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Error reading users file: ${err}` });
  }
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 3600000, // 1 hour
  });
  res.json({ token, name: user.name });
});

app.get("/api/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, user });
  } catch (err) {
    res
      .status(401)
      .json({ message: `Authentication failed: ${err}`, authenticated: false });
  }
});

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
