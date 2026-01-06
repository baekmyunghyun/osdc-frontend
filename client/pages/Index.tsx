import WorldMap from "@/components/WorldMap";
import Dashboard from "@/components/Dashboard";
import TPSChart from "@/components/charts/TPSChart";
import LatencyChart from "@/components/charts/LatencyChart";
import CoordinationShardView from "@/components/CoordinationShardView";
import { useState, useEffect } from "react";

interface TimeSeriesData {
  x: number;
  totalTPS: number;
  averageSingleShardTPS: number;
  averageCrossShardTransactionLatency: number;
  averageSingleShardTransactionLatency: number;
  currentTPS: number;
  currentLatency: number;
  timestamp: number;
}

interface ChartDataPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface FullDashboardData {
  timeSeries: TimeSeriesData[];
  charts: {
    transactionPerSecond: ChartDataPoint[];
    transactionConfirmationTime: ChartDataPoint[];
  };
}

interface LogData {
  fullDashboard: FullDashboardData;
}

export default function Index() {
  const [metrics, setMetrics] = useState({
    totalTPS: 0,
    avgSingleShardTPS: 0,
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
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [chartsData, setChartsData] = useState<{
    tps: ChartDataPoint[];
    latency: ChartDataPoint[];
  }>({ tps: [], latency: [] });

  useEffect(() => {
    fetch("/api/logs")
      .then((res) => {
        if (!res.ok) {
           throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: LogData) => {
        if (data && data.fullDashboard) {
          if (data.fullDashboard.timeSeries) {
            setTimeSeriesData(data.fullDashboard.timeSeries);
          }
          if (data.fullDashboard.charts) {
            setChartsData({
              tps: data.fullDashboard.charts.transactionPerSecond,
              latency: data.fullDashboard.charts.transactionConfirmationTime,
            });
          }
        }
      })
      .catch((err) => console.error("Failed to load logs:", err));
  }, []);

  useEffect(() => {
    if (timeSeriesData.length === 0) return;

    let currentIndex = 0;
    let currentTotalTx = 0;

    const interval = setInterval(() => {
      if (currentIndex >= timeSeriesData.length) {
        currentIndex = 0; // Loop back to start or stop
        // clearInterval(interval); // Uncomment to stop at end
        // return;
      }

      const currentData = timeSeriesData[currentIndex];
      const timeStr = currentData.x.toString();
      const now = new Date(); // Use current time for log timestamp or use real timestamp from data
      const timestamp = now.toISOString().split("T")[1].slice(0, -1);

      // Random generation logic only for fields not in JSON for now, or keep them if needed
      // const randomTotalTPS = Math.floor(Math.random() * 3000) + 2000; // 2000-5000
      // const randomSingleShardTPS = Math.floor(
      //   randomTotalTPS * (0.3 + Math.random() * 0.1),
      // );
       const randomLatency = parseFloat((Math.random() * 0.5 + 0.3).toFixed(6));
      const randomLeaderTime = "00.00";
      const randomCommitteeTime = "00.00";

      // Use data from JSON
      const totalTPS = currentData.totalTPS;
      const singleShardTPS = currentData.averageSingleShardTPS;
      const crossShardLatency = currentData.averageCrossShardTransactionLatency;
      
      // Accumulate Total Tx if needed or assume it's cumulative in real app, but here we just sum TPS roughly
       currentTotalTx += totalTPS; 

      setMetrics({
        totalTPS: totalTPS,
        avgSingleShardTPS: singleShardTPS,
        avgCrossShardLatency: crossShardLatency,
        totalTransactions: currentTotalTx, 
        leaderChangeTime: randomLeaderTime, // Still random as requested only specific fields
        committeeChangeTime: randomCommitteeTime, // Still random
        blockHeight: currentIndex, // Using index as block height simulation
      });

      // Update Charts
      if (chartsData.tps.length > currentIndex) {
        const tpsPoint = chartsData.tps[currentIndex];
        setTpsData((prev) => {
          const newData = [...prev, { time: tpsPoint.x.toString(), value: tpsPoint.y }];
          return newData.slice(-50); // Keep last 50 points
        });
      }

      if (chartsData.latency.length > currentIndex) {
        const latencyPoint = chartsData.latency[currentIndex];
        setLatencyData((prev) => {
          const newData = [...prev, { time: latencyPoint.x.toString(), value: latencyPoint.y }];
          return newData.slice(-50); // Keep last 50 points
        });
      }

      // Update Logs - Placeholder or need real log parsing if available
      const dummyLog = `[DEBUG] ${timestamp} replica.go:109: [1] received a block from ${Math.floor(Math.random() * 4)}, Round is ${currentIndex}`;
      setLogs((prev) => {
        const newLogs = [...prev, dummyLog];
        return newLogs.slice(-20); // Keep last 20 logs
      });

      currentIndex++;
    }, 1000);

    return () => clearInterval(interval);
  }, [timeSeriesData, chartsData]);

  return (
    <Dashboard
      metrics={{
        totalTPS: metrics.totalTPS.toLocaleString(),
        avgSingleShardTPS: metrics.avgSingleShardTPS.toLocaleString(),
        avgLatency: metrics.avgCrossShardLatency.toFixed(6),
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
      {activeTab === 2 && (
        <div className="flex items-center justify-center h-full text-2xl text-gray-400 font-bold">
          Screen 2
        </div>
      )}
      {activeTab === 3 && <WorldMap showShardNumbers={false} activeTab={3} />}
    </Dashboard>
  );
}
