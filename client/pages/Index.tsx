import WorldMap, { WorldMapHandle } from "@/components/WorldMap";
import Dashboard from "@/components/Dashboard";
import TPSChart from "@/components/charts/TPSChart";
import LatencyChart from "@/components/charts/LatencyChart";
import CoordinationShardView from "@/components/CoordinationShardView";
import { useState, useEffect, useRef } from "react";

interface LogEntry {
  second_offset: number;
  tps: number;
  avgSingleShardTPS: number;
  avg_latency_seconds_local: number;
  avg_latency_seconds_cross: number | null;
  transaction_confirmation_time: number;
  cumulative_tx: number;
}

interface AnimationLogEntry {
  from_shard: number;
  to_shard: number;
  from_node: number;
  to_node: number;
  category: string;
}

export default function Index() {
  const [metrics, setMetrics] = useState({
    totalTPS: 0,
    avgSingleShardTPS: 0,
    avgSingleShardLatency: 0,
    avgCrossShardLatency: 0,
    totalTransactions: 0,
    leaderChangeTime: "00.00",
    committeeChangeTime: "00.00",
    blockHeight: 0,
  });

  const [tpsData, setTpsData] = useState<{ time: string; value: number }[]>([]);
  const [latencyData, setLatencyData] = useState<{ time: string; value: number }[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [timeSeriesData, setTimeSeriesData] = useState<LogEntry[]>([]);
  
  const mainLogsRef = useRef<string[]>([]);
  const mainLogCursorRef = useRef(0);
  const worldMapRef = useRef<WorldMapHandle>(null);
  
  // 애니메이션 큐 (WebSocket → RAF에서 처리)
  const animQueueRef = useRef<AnimationLogEntry[]>([]);
  const animCountRef = useRef(0);
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    fetch("/api/raw-logs")
      .then((res) => res.text())
      .then((text) => {
        mainLogsRef.current = text.split("\n").filter((l) => l.trim() !== "");
      })
      .catch((err) => console.error("Failed to load raw logs:", err));

    fetch("/api/logs")
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setTimeSeriesData(data.map((d) => ({
            second_offset: d.second_offset,
            tps: d.tps,
            avgSingleShardTPS: d.avgSingleShardTPS,
            avg_latency_seconds_local: d.avg_latency_seconds_local,
            avg_latency_seconds_cross: d.avg_latency_seconds_cross,
            transaction_confirmation_time: d.transaction_confirmation_time,
            cumulative_tx: d.cumulative_tx,
          })));
        }
      })
      .catch((err) => console.error("Failed to load logs:", err));

    // WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/logs`);

    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onerror = (e) => console.error("❌ WebSocket error:", e);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        
        if (msg.type === "complete") {
          console.log("✅ Stream complete. Total:", animCountRef.current);
          return;
        }
        if (msg.type !== "batch" || !Array.isArray(msg.data)) return;

        // 배치 파싱 후 큐에 추가
        for (let i = 0; i < msg.data.length; i++) {
          try {
            const entry = JSON.parse(msg.data[i]);
            if (entry.from_shard !== undefined && entry.from_node !== undefined) {
              animQueueRef.current.push(entry);
            }
          } catch {}
        }
      } catch {}
    };

    return () => ws.close();
  }, []);

  // RAF 기반 애니메이션 처리 (렉 방지)
  useEffect(() => {
    let rafId: number;
    const MAX_PER_FRAME = 100; // 프레임당 최대 100개 처리
    
    const processQueue = () => {
      const queue = animQueueRef.current;
      
      if (queue.length > 0 && worldMapRef.current) {
        const toProcess = Math.min(queue.length, MAX_PER_FRAME);
        
        for (let i = 0; i < toProcess; i++) {
          const entry = queue[i];
          const toShard = entry.to_shard ?? entry.from_shard;

          // Single Shard mode (Tab 3): Filter specific shards
          if (activeTabRef.current === 3) {
            const allowed = [0, 7, 21];
            if (!allowed.includes(entry.from_shard) || !allowed.includes(toShard)) {
              continue;
            }
          }

          worldMapRef.current.addParticle(
            entry.from_shard,
            toShard,
            entry.from_node,
            entry.to_node,
            entry.category
          );
          animCountRef.current++;
        }
        
        // 처리한 항목 제거
        animQueueRef.current = queue.slice(toProcess);
        
        if (animCountRef.current % 5000 === 0) {
          console.log(`🎯 Animations: ${animCountRef.current}, Queue: ${animQueueRef.current.length}`);
        }
      }
      
      rafId = requestAnimationFrame(processQueue);
    };
    
    rafId = requestAnimationFrame(processQueue);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Chart 업데이트
  useEffect(() => {
    if (timeSeriesData.length === 0) return;

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= timeSeriesData.length) idx = 0;
      const d = timeSeriesData[idx];
      
      setMetrics({
        totalTPS: d.tps,
        avgSingleShardTPS: d.avgSingleShardTPS,
        avgSingleShardLatency: d.avg_latency_seconds_local,
        avgCrossShardLatency: d.avg_latency_seconds_cross ?? 0,
        totalTransactions: d.cumulative_tx,
        leaderChangeTime: "00.00",
        committeeChangeTime: "00.00",
        blockHeight: d.second_offset,
      });

      setTpsData((prev) => [...prev, { time: d.second_offset.toString(), value: d.tps }].slice(-50));
      setLatencyData((prev) => [...prev, { time: d.second_offset.toString(), value: d.transaction_confirmation_time }].slice(-50));
      idx++;
    }, 1000);

    return () => clearInterval(interval);
  }, [timeSeriesData]);

  // Main Logs 스트리밍
  useEffect(() => {
    const interval = setInterval(() => {
      if (mainLogsRef.current.length > 0) {
        const start = mainLogCursorRef.current;
        const end = Math.min(start + 2, mainLogsRef.current.length);
        if (start < mainLogsRef.current.length) {
          setLogs(prev => [...prev, ...mainLogsRef.current.slice(start, end)].slice(-100));
          mainLogCursorRef.current = end;
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Dashboard
      metrics={{
        totalTPS: metrics.totalTPS.toLocaleString(),
        avgSingleShardTPS: metrics.avgSingleShardTPS.toLocaleString(),
        avgSingleShardLatency: metrics.avgSingleShardLatency.toFixed(6),
        avgCrossShardLatency: metrics.avgCrossShardLatency.toFixed(6),
        totalTx: metrics.totalTransactions.toLocaleString(),
        leaderChangeTime: metrics.leaderChangeTime,
        committeeChangeTime: metrics.committeeChangeTime,
      }}
      logs={logs}
      charts={{
        tpsChart: <TPSChart data={tpsData} />,
        latencyChart: <LatencyChart data={latencyData} />,
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 1 && <WorldMap ref={worldMapRef} showShardNumbers={true} activeTab={1} />}
      {activeTab === 2 && <CoordinationShardView />}
      {activeTab === 3 && <WorldMap ref={worldMapRef} showShardNumbers={true} activeTab={3} />}
    </Dashboard>
  );
}