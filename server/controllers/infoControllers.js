import fs from "fs";
import path from "path";

export function addUpcomingDate(req, res) {
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({ message: "Date and time are required" });
  }
  const upcomingFile = path.join(process.cwd(), "src/data/upcoming.json");

  let upcoming = [];

  try {
    if (fs.existsSync(upcomingFile)) {
      const data = fs.readFileSync(upcomingFile, "utf-8");
      upcoming = JSON.parse(data || "[]");
    }

    // Add the new session
    upcoming.push({ date, time });
    fs.writeFileSync(upcomingFile, JSON.stringify(upcoming, null, 2));
    res.status(201).json({ message: "Session added", session: { date, time } });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error updating upcoming sessions: ${err}` });
  }
}

export function deleteUpcomingDate(req, res) {
  const { date, time } = req.body;
  if (!date || !time) {
    return res.status(400).json({ message: "Date and time are required" });
  }
  const upcomingFile = path.join(process.cwd(), "src/data/upcoming.json");
  let upcoming = [];
  try {
    if (fs.existsSync(upcomingFile)) {
      const data = fs.readFileSync(upcomingFile, "utf-8");
      upcoming = JSON.parse(data || "[]");
    }
    const initialLength = upcoming.length;
    upcoming = upcoming.filter(
      (session) => session.date !== date || session.time !== time
    );
    if (upcoming.length === initialLength) {
      return res.status(404).json({ message: "Session not found" });
    }
    fs.writeFileSync(upcomingFile, JSON.stringify(upcoming, null, 2));
    res.status(200).json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ message: `Error deleting session: ${err}` });
  }
}
