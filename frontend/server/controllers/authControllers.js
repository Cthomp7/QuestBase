import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const usersFile = path.join(process.cwd(), "server/users.json");

export async function register(req, res) {
  const { email, password, code } = req.body;
  if (!email || !password || !code) {
    return res
      .status(400)
      .json({ message: "Email, password, and code are required" });
  }

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
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

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
    maxAge: 3600000,
  });
  res.json({ token, name: user.name, permission: user.permission });
}

export function checkAuth(req, res) {
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
}
