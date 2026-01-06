import React, { useEffect, useRef } from "react";
import "./Dashboard.css";

interface DashboardProps {
  metrics: {
    totalTPS: string | number;
    avgSingleShardTPS: string | number;
    avgLatency: string | number;
    totalTx: string | number;
    leaderChangeTime: string | number;
    committeeChangeTime: string | number;
  };
  logs: string[];
  charts: {
    tpsChart: React.ReactNode;
    latencyChart: React.ReactNode;
  };
  children: React.ReactNode;
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  logs,
  charts,
  children,
  activeTab,
  onTabChange,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getButtonStyle = (tabIndex: number) => {
    const isActive = activeTab === tabIndex;
    return {
      padding: "20px",
      backgroundColor: "#FFF",
      borderRadius: "8px",
      border: isActive ? "1.25px solid #6C6E82" : "1.25px solid #9E9E9E",
      color: isActive ? "#000" : "#9E9E9E",
      fontWeight: "700",
      fontSize: "20px",
      lineHeight: "20px",
      cursor: "pointer",
      transition: "all 0.2s",
    } as React.CSSProperties;
  };

  return (
    <div className="dashboard-container">
      {/* 1. 좌측 사이드바 */}
      <div className="sidebar">
        <MetricItem label="Total TPS" value={metrics.totalTPS} />
        <MetricItem
          label="Average Single Shard TPS"
          value={metrics.avgSingleShardTPS}
        />
        <MetricItem
          label="Average Cross Shard Transaction Latency"
          value={metrics.avgLatency}
        />
        <MetricItem label="Total Transactions" value={metrics.totalTx} />
        <MetricItem
          label="Leader Change Time"
          value={metrics.leaderChangeTime}
        />
        <MetricItem
          label="Committee Change Time"
          value={metrics.committeeChangeTime}
        />

        <div className="log-container" ref={logContainerRef}>
          <div className="log-header">block id:</div>
          {logs &&
            logs.map((log, index) => (
              <div key={index} className="log-entry">
                {log}
              </div>
            ))}
        </div>
      </div>

      {/* 2. 우측 메인 컨텐츠 */}
      <div className="main-content">
        {/* 상단 차트 영역 */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-title">Transaction Per Second</div>
            {charts.tpsChart}
          </div>
          <div className="chart-container">
            <div className="chart-title">Transaction Confirmation Time</div>
            {charts.latencyChart}
          </div>
        </div>

        {/* 하단 지도 영역 */}
        <div className="map-section">
          {/* Navigation Buttons */}
          <div
            style={{
              position: "absolute",
              top: "24px",
              left: "24px",
              zIndex: 10,
              display: "flex",
              gap: "12px",
            }}
          >
            <button style={getButtonStyle(1)} onClick={() => onTabChange(1)}>
              1
            </button>
            <button style={getButtonStyle(2)} onClick={() => onTabChange(2)}>
              2
            </button>
            <button style={getButtonStyle(3)} onClick={() => onTabChange(3)}>
              3
            </button>
          </div>

          {/* Legend Box - Right Side (only on screen 1) */}
          {activeTab === 1 && (
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              zIndex: 10,
              padding: "24px",
              backgroundColor: "#E9E9EA",
              border: "2px solid #000",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Shard Area */}
            <div style={{ display: "flex", gap: "48px" }}>
              {/* Shard Item */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "1000px",
                    backgroundColor: "#000",
                  }}
                ></div>
                <div
                  style={{
                    color: "#000",
                    fontFamily:
                      "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "24px",
                  }}
                >
                  shard
                </div>
              </div>

              {/* Backup Item */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "1000px",
                    backgroundColor: "#FFF",
                    border: "2px solid #000",
                  }}
                ></div>
                <div
                  style={{
                    color: "#000",
                    fontFamily:
                      "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "24px",
                  }}
                >
                  backup
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* Vote Message */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="4" r="4" fill="#FF00FF" />
                </svg>
                <div
                  style={{
                    color: "#000",
                    fontFamily:
                      "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "24px",
                  }}
                >
                  vote message
                </div>
              </div>

              {/* Shard Message */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="4" r="4" fill="#0000FF" />
                </svg>
                <div
                  style={{
                    color: "#000",
                    fontFamily:
                      "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "24px",
                  }}
                >
                  shard message
                </div>
              </div>

              {/* Committee Change Message */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="4" r="4" fill="#FF8800" />
                </svg>
                <div
                  style={{
                    color: "#000",
                    fontFamily:
                      "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "24px",
                  }}
                >
                  committee change message
                </div>
              </div>
            </div>
          </div>
          )}

          {/* 실제 지도가 렌더링 될 영역 */}
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="metric-item">
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
  </div>
);

export default Dashboard;
