import WorldMap from "@/components/WorldMap";
import Dashboard from "@/components/Dashboard";
import TPSChart from "@/components/charts/TPSChart";
import LatencyChart from "@/components/charts/LatencyChart";
import CoordinationShardView from "@/components/CoordinationShardView";
import { useState, useEffect } from "react";

interface LogEntry {
  second_offset: number;
  tps: number;
  avgSingleShardTPS: number;
  avg_latency_seconds_local: number;
  avg_latency_seconds_cross: number | null;
  transaction_confirmation_time: number;
  cumulative_tx: number;
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
  const [latencyData, setLatencyData] = useState<
    { time: string; value: number }[]
  >([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [timeSeriesData, setTimeSeriesData] = useState<LogEntry[]>([]);
  const [rawLogs, setRawLogs] = useState<{ timestamp: number; text: string }[]>(
    [],
  );

  useEffect(() => {
    // Fetch metrics data
    fetch("/api/logs")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          // Map old field names to new ones if needed
          const mapped = data.map((d) => ({
            second_offset: d.second_offset,
            tps: d.tps,
            avgSingleShardTPS: d.avgSingleShardTPS,
            avg_latency_seconds_local: d.avg_latency_seconds_local,
            avg_latency_seconds_cross: d.avg_latency_seconds_cross,
            transaction_confirmation_time: d.transaction_confirmation_time,
            cumulative_tx: d.cumulative_tx,
          }));
          setTimeSeriesData(mapped);
        }
      })
      .catch((err) => console.error("Failed to load logs:", err));

    // Fetch raw logs
    fetch("/api/raw-logs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load raw logs");
        return res.text();
      })
      .then((text) => {
        const lines = text.split("\n");
        const parsed = lines
          .map((line) => {
            // Match: 2025/08/28 05:18:49.563399
            const match = line.match(
              /(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d+)/,
            );
            if (match) {
              const dateStr = match[1].replace(/\//g, "-").replace(" ", "T") + "Z";
              const timestamp = new Date(dateStr).getTime();
              return { timestamp, text: line };
            }
            return null;
          })
          .filter(
            (l): l is { timestamp: number; text: string } => l !== null,
          );
        setRawLogs(parsed);
      })
      .catch((err) => console.error(err));
  }, []);

    useEffect(() => {
    if (timeSeriesData.length === 0 || rawLogs.length === 0) return;

    // Configuration
    const LOG_SPEED_MULTIPLIER = 10; // Logs run 10x faster
    const CHART_UPDATE_INTERVAL = 1000; // Charts update every 1s (real-time for 1s data)
    const LOG_UPDATE_INTERVAL = 100; // Check for logs every 100ms
    
    // State for simulation
    let currentChartIndex = 0;
    
    // 1. Chart/Metrics Interval (Runs every 1 second)
    const chartInterval = setInterval(() => {
      if (currentChartIndex >= timeSeriesData.length) {
        currentChartIndex = 0; // Loop charts
      }

      const currentData = timeSeriesData[currentChartIndex];
      const timeStr = currentData.second_offset.toString();

      const randomLeaderTime = "00.00";
      const randomCommitteeTime = "00.00";

      setMetrics({
        totalTPS: currentData.tps,
        avgSingleShardTPS: currentData.avgSingleShardTPS,
        avgSingleShardLatency: currentData.avg_latency_seconds_local,
        avgCrossShardLatency: currentData.avg_latency_seconds_cross ?? 0,
        totalTransactions: currentData.cumulative_tx,
        leaderChangeTime: randomLeaderTime,
        committeeChangeTime: randomCommitteeTime,
        blockHeight: currentData.second_offset,
      });

      setTpsData((prev) => {
        const newData = [...prev, { time: timeStr, value: currentData.tps }];
        return newData.slice(-50);
      });

      setLatencyData((prev) => {
        const newData = [
          ...prev,
          { time: timeStr, value: currentData.transaction_confirmation_time },
        ];
        return newData.slice(-50);
      });

      currentChartIndex++;
    }, CHART_UPDATE_INTERVAL);

    // 2. Log Interval (Runs fast)
    // No timestamp in new metric, so just loop logs as before
    let currentLogSimTime = 0;
    const logInterval = setInterval(() => {
      // Advance log time
      const timeIncrement = LOG_UPDATE_INTERVAL * LOG_SPEED_MULTIPLIER;

      const logsInWindow = rawLogs.slice(currentLogSimTime, currentLogSimTime + timeIncrement);

      if (logsInWindow.length > 0) {
        setLogs((prev) => {
        const newEntries = logsInWindow.map((l) => l.text);
        return [...prev, ...newEntries].slice(-20);
        });
      }
        
      currentLogSimTime += timeIncrement;
      if (currentLogSimTime >= rawLogs.length) {
        currentLogSimTime = 0;
      }

    }, LOG_UPDATE_INTERVAL);

    return () => {
      clearInterval(chartInterval);
      clearInterval(logInterval);
    };
    }, [timeSeriesData, rawLogs]);

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
      {activeTab === 1 && <WorldMap showShardNumbers={true} activeTab={1} />}
      {activeTab === 2 && <CoordinationShardView />}
      {activeTab === 3 && <WorldMap showShardNumbers={false} activeTab={3} />}
    </Dashboard>
  );
}
