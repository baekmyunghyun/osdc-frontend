import { RequestHandler } from "express";
import path from "path";
import fs from "fs";

export const handleGetLogs: RequestHandler = (req, res) => {
  const logPath = path.join(process.cwd(), "logs", "summary_tps.json");
  
  if (fs.existsSync(logPath)) {
      res.sendFile(logPath);
  } else {
      res.status(404).json({ error: "Log file not found at " + logPath });
  }
};

export const handleGetRawLogs: RequestHandler = (req, res) => {
  const logPath = path.join(process.cwd(), "logs", "main.4134.log"); // Updated to read main.4134.log

  if (fs.existsSync(logPath)) {
    res.sendFile(logPath);
  } else {
    res.status(404).send("Log file not found at " + logPath);
  }
};
