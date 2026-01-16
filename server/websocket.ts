import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import fs from "fs";
import path from "path";
import readline from "readline";

export function setupWebSocket(server: Server) {
  // Use noServer mode to avoid conflict with Vite HMR or other listeners
  const wss = new WebSocketServer({ noServer: true });

  console.log("WebSocket server configured at /ws/logs");

  server.on("upgrade", (request, socket, head) => {
    const pathname = request.url;
    
    if (pathname === "/ws/logs") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected to WebSocket");
    
    // Send initial status
    ws.send(JSON.stringify({ type: "status", message: "Connected to log stream" }));

    const logPath = path.join(process.cwd(), "logs", "log.json");
    
    if (!fs.existsSync(logPath)) {
        ws.send(JSON.stringify({ type: "error", message: "Log file not found" }));
        return;
    }

    console.log("Streaming logs from:", logPath);
    streamLogs(ws, logPath);

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}

function streamLogs(ws: WebSocket, filePath: string) {
    const fileStream = fs.createReadStream(filePath);
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let batch: string[] = [];
    const BATCH_SIZE = 50; // Smaller batch size for smoother client experience
    
    rl.on('line', (line) => {
        let cleanLine = line.trim();
        
        // Remove Array brackets and trailing commas to get valid JSON object strings
        if (cleanLine === '[' || cleanLine === ']') return;
        if (cleanLine.endsWith(',')) {
            cleanLine = cleanLine.slice(0, -1);
        }

        if (cleanLine.length > 0) {
            batch.push(cleanLine);

            if (batch.length >= BATCH_SIZE) {
                // Throttle: Pause reading, send, wait, resume.
                rl.pause();
                sendBatch();
                setTimeout(() => {
                    rl.resume();
                }, 50); // 50ms delay between batches (~1k lines/sec max)
            }
        }
    });

    rl.on('close', () => {
        if (batch.length > 0) {
            sendBatch();
        }
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "complete" }));
        }
    });

    function sendBatch() {
        if (ws.readyState === WebSocket.OPEN) {
            // Check buffered amount to avoid flooding
            if (ws.bufferedAmount > 1024 * 1024) { // 1MB buffer
                // Simple flow control: pause reading if buffer is full
                // readline doesn't expose easy pause/resume based on sync consumer
                // But we can just send. If client can't keep up, we might need a better strategy.
                // For now, allow it to fill.
            }
            
            // console.log(`[WS] Sending batch of ${batch.length} items`);
            ws.send(JSON.stringify({ type: "batch", data: batch }));
            batch = [];
        } else {
            rl.close();
            fileStream.destroy();
        }
    }
}
