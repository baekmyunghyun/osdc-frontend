import React, { useEffect, useRef } from 'react';
import './Dashboard.css';

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
}

const Dashboard: React.FC<DashboardProps> = ({ 
  metrics, 
  logs, 
  charts, 
  children 
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="dashboard-container">
      {/* 1. 좌측 사이드바 */}
      <div className="sidebar">
        <MetricItem label="Total TPS" value={metrics.totalTPS} />
        <MetricItem label="Average Single Shard TPS" value={metrics.avgSingleShardTPS} />
        <MetricItem label="Average Cross Shard Transaction Latency" value={metrics.avgLatency} />
        <MetricItem label="Total Transactions" value={metrics.totalTx} />
        <MetricItem label="Leader Change Time" value={metrics.leaderChangeTime} />
        <MetricItem label="Committee Change Time" value={metrics.committeeChangeTime} />
        
        <div className="log-container" ref={logContainerRef}>
          <div className="log-header">block id:</div>
          {logs && logs.map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
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
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            zIndex: 10,
            display: 'flex',
            gap: '12px'
          }}>
            <button style={{
              padding: '20px',
              backgroundColor: '#FFF',
              borderRadius: '8px',
              border: '1.25px solid #9E9E9E',
              color: '#9E9E9E',
              fontWeight: '700',
              fontSize: '20px',
              lineHeight: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Base Committee
            </button>
            <button style={{
              padding: '20px',
              backgroundColor: '#FFF',
              borderRadius: '8px',
              border: '1.25px solid #6C6E82',
              color: '#000',
              fontWeight: '700',
              fontSize: '20px',
              lineHeight: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Overview
            </button>
            <button style={{
              padding: '20px',
              backgroundColor: '#FFF',
              borderRadius: '8px',
              border: '1.25px solid #6C6E82',
              color: '#000',
              fontWeight: '700',
              fontSize: '20px',
              lineHeight: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Overview
            </button>
          </div>

          <div className="map-legend">
            <div className="legend-item">
              <span className="dot" style={{background: '#d500f9'}}></span>
              selective local snapshot
            </div>
            <div className="legend-item">
              <span className="dot" style={{background: '#2962ff'}}></span>
              global snapshot
            </div>
          </div>

          {/* 실제 지도가 렌더링 될 영역 */}
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
             {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="metric-item">
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
  </div>
);

export default Dashboard;
