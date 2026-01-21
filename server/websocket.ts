import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import fs from "fs";
import path from "path";
import readline from "readline";

interface LogEntry {
  from_timestamp: string | null;
  to_timestamp: string;
  from_shard: number;
  to_shard: number;
  from_node: number;
  to_node: number;
  category: string;
}

interface OldLogEntry {
  timestamp: string;
  shard: number;
  from_node: number;
  to_node: number;
  message_type?: string;
  category: string;
}

function parseTimestamp(ts: string): number {
  const parts = ts.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const secondsWithMs = parseFloat(parts[2]);
  return (hours * 3600 + minutes * 60 + secondsWithMs) * 1000;
}

function isNewFormat(obj: any): obj is LogEntry {
  return obj?.to_timestamp && typeof obj.from_shard === "number";
}

function isOldFormat(obj: any): obj is OldLogEntry {
  return obj?.timestamp && typeof obj.shard === "number";
}

function convertOldToNew(old: OldLogEntry): LogEntry {
  const timePart = old.timestamp.split(" ")[1] || old.timestamp;
  return {
    from_timestamp: null,
    to_timestamp: timePart,
    from_shard: old.shard,
    to_shard: old.shard,
    from_node: old.from_node,
    to_node: old.to_node,
    category: old.category,
  };
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });
  console.log("WebSocket server configured at /ws/logs");

  server.on("upgrade", (request, socket, head) => {
    if (request.url === "/ws/logs") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected to WebSocket");
    ws.send(JSON.stringify({ type: "status", message: "Connected" }));

    const logPath = path.join(process.cwd(), "logs", "merged_messages.json");
    if (!fs.existsSync(logPath)) {
      ws.send(JSON.stringify({ type: "error", message: "Log file not found" }));
      return;
    }

    loadAndStreamLogs(ws, logPath);
    ws.on("close", () => console.log("Client disconnected"));
  });
}

async function loadAndStreamLogs(ws: WebSocket, filePath: string) {
  // ============ 설정 ============
  const SPEED_MULTIPLIER = 10;
  const TICK_INTERVAL = 100;      // 100ms마다 체크 (50 → 100)
  const MAX_BATCH_SIZE = 500;     // 한번에 최대 500개 (병목 방지)
  
  // ============ 로그 로드 ============
  const logs: { timestamp: number; data: string }[] = [];
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    let cleanLine = line.trim();
    if (cleanLine === '[' || cleanLine === ']') continue;
    if (cleanLine.endsWith(',')) cleanLine = cleanLine.slice(0, -1);
    if (!cleanLine) continue;

    try {
      const parsed = JSON.parse(cleanLine);
      let entry: LogEntry | null = null;
      
      if (isNewFormat(parsed)) entry = parsed;
      else if (isOldFormat(parsed)) entry = convertOldToNew(parsed);
      
      if (entry) {
        // 미리 JSON 문자열로 변환해서 저장 (전송 시 재변환 방지)
        logs.push({ 
          timestamp: parseTimestamp(entry.to_timestamp), 
          data: JSON.stringify(entry)
        });
      }
    } catch {}
  }

  console.log(`[WS] ✅ Loaded ${logs.length} logs`);
  if (logs.length === 0) {
    ws.send(JSON.stringify({ type: "error", message: "No valid logs" }));
    return;
  }

  logs.sort((a, b) => a.timestamp - b.timestamp);
  
  const startLogTime = logs[0].timestamp;
  const endLogTime = logs[logs.length - 1].timestamp;
  console.log(`[WS] 🚀 Playback ${SPEED_MULTIPLIER}x (${((endLogTime - startLogTime) / 1000).toFixed(1)}s of logs)`);

  // ============ 시간 기반 재생 ============
  const realStartTime = Date.now();
  let cursor = 0;
  let sentCount = 0;

  const interval = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
      clearInterval(interval);
      return;
    }

    const simElapsed = (Date.now() - realStartTime) * SPEED_MULTIPLIER;
    const currentSimTime = startLogTime + simElapsed;

    // 현재 시간까지의 로그 수집 (최대 MAX_BATCH_SIZE개)
    const batch: string[] = [];
    while (cursor < logs.length && logs[cursor].timestamp <= currentSimTime && batch.length < MAX_BATCH_SIZE) {
      batch.push(logs[cursor].data);
      cursor++;
    }

    if (batch.length > 0) {
      // 단일 메시지로 전송
      ws.send(JSON.stringify({ type: "batch", data: batch }));
      sentCount += batch.length;
      
      if (sentCount % 5000 === 0) {
        console.log(`[WS] 📤 ${sentCount}/${logs.length}`);
      }
    }

    if (cursor >= logs.length) {
      clearInterval(interval);
      ws.send(JSON.stringify({ type: "complete" }));
      console.log(`[WS] ✅ Complete! ${sentCount} logs in ${((Date.now() - realStartTime) / 1000).toFixed(1)}s`);
    }
  }, TICK_INTERVAL);

  ws.on("close", () => clearInterval(interval));
}