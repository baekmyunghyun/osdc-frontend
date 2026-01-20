import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetLogs, handleGetRawLogs, handleGetConsensusLogs, handleGetSnapshotLogs } from "./routes/logs";

export function createServer() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: [
        "https://builder.io",
        "http://localhost:3000",
        "http://localhost:5173",
        process.env.CORS_ORIGIN,
      ].filter(Boolean),
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/logs", handleGetLogs);
  app.get("/api/raw-logs", handleGetRawLogs);
  app.get("/api/logs/consensus", handleGetConsensusLogs);
  app.get("/api/logs/snapshots", handleGetSnapshotLogs);

  return app;
}
