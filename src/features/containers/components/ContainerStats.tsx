import type { ContainerStats as ContainerStatsType } from '../types';

const mockStatsData: ContainerStatsType[] = [
  {
    id: 'web-server',
    name: 'web-server',
    cpuPercent: 12.5,
    memoryUsage: '256MB',
    memoryLimit: '512MB',
    memoryPercent: 50,
    networkRx: '1.2 MB',
    networkTx: '856 KB',
    blockRead: '45 MB',
    blockWrite: '12 MB',
  },
  {
    id: 'database',
    name: 'database',
    cpuPercent: 35.8,
    memoryUsage: '1.8GB',
    memoryLimit: '2GB',
    memoryPercent: 90,
    networkRx: '5.4 MB',
    networkTx: '3.2 MB',
    blockRead: '234 MB',
    blockWrite: '156 MB',
  },
];

export function ContainerStats() {
  return (
    <div className="container-stats">
      <div className="stats-header">
        <h2>Container Statistics</h2>
        <div className="stats-controls">
          <button className="control-btn">Auto Refresh: ON</button>
          <button className="refresh-btn">Refresh</button>
        </div>
      </div>

      <div className="stats-grid">
        {mockStatsData.map((stats) => (
          <div key={stats.id} className="stats-card">
            <div className="card-header">
              <h3>{stats.name}</h3>
              <span className="status-indicator running"></span>
            </div>

            <div className="stats-metrics">
              <div className="metric-item">
                <div className="metric-label">CPU Usage</div>
                <div className="metric-value">{stats.cpuPercent}%</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill cpu"
                    style={{ width: `${stats.cpuPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-label">Memory Usage</div>
                <div className="metric-value">
                  {stats.memoryUsage} / {stats.memoryLimit}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill memory"
                    style={{ width: `${stats.memoryPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-item-small">
                  <div className="metric-label">Network RX</div>
                  <div className="metric-value-small">{stats.networkRx}</div>
                </div>
                <div className="metric-item-small">
                  <div className="metric-label">Network TX</div>
                  <div className="metric-value-small">{stats.networkTx}</div>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-item-small">
                  <div className="metric-label">Block Read</div>
                  <div className="metric-value-small">{stats.blockRead}</div>
                </div>
                <div className="metric-item-small">
                  <div className="metric-label">Block Write</div>
                  <div className="metric-value-small">{stats.blockWrite}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-chart-placeholder">
        <h3>Real-time Performance Chart</h3>
        <div className="chart-area">
          <p>Chart visualization area (CPU, Memory, Network trends)</p>
        </div>
      </div>
    </div>
  );
}
