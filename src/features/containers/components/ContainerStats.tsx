import { useState, useMemo, useCallback } from 'react';
import { useContainerStats } from '../hooks';
import { useHosts } from '../../hosts';
import { StatsTrendChart } from './StatsTrendChart';
import type { ContainerStat, StatsSortField, SortDirection, StatsFilter, TrendTimeRange } from '../types';

function parseMemoryToBytes(memStr: string): number {
  const match = memStr.match(/^([\d.]+)\s*(B|KB|KiB|MB|MiB|GB|GiB|TB|TiB)$/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  const multipliers: Record<string, number> = {
    'B': 1,
    'KB': 1000,
    'KIB': 1024,
    'MB': 1000000,
    'MIB': 1048576,
    'GB': 1000000000,
    'GIB': 1073741824,
    'TB': 1000000000000,
    'TIB': 1099511627776,
  };

  return value * (multipliers[unit] || 1);
}

function parseNetworkToBytes(netStr: string): number {
  return parseMemoryToBytes(netStr);
}

function getStatusIcon(cpuPercent: number, memoryPercent: number): string {
  if (cpuPercent === 0 && memoryPercent === 0) {
    return '⚪';
  }
  return '🟢';
}

function isContainerRunning(stat: ContainerStat): boolean {
  return stat.cpu_percent > 0 || stat.memory_percent > 0 || parseMemoryToBytes(stat.memory_usage) > 0;
}

export function ContainerStats() {
  const [selectedHost, setSelectedHost] = useState<string>('');
  const [sortField, setSortField] = useState<StatsSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filter, setFilter] = useState<StatsFilter>('all');
  const [selectedContainer, setSelectedContainer] = useState<ContainerStat | null>(null);
  const [timeRange, setTimeRange] = useState<TrendTimeRange>('10m');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: hosts = [] } = useHosts();
  const { data: stats = [], isLoading, error, refetch } = useContainerStats(
    selectedHost,
    autoRefresh ? 5000 : undefined
  );

  const handleHostChange = useCallback((host: string) => {
    setSelectedHost(host);
    setSelectedContainer(null);
  }, []);

  if (hosts.length > 0 && !selectedHost) {
    handleHostChange(hosts[0].host);
  }

  const handleSort = (field: StatsSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedStats = useMemo(() => {
    let result = [...stats];

    if (filter === 'running') {
      result = result.filter(isContainerRunning);
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cpu_percent':
          comparison = a.cpu_percent - b.cpu_percent;
          break;
        case 'memory_usage':
          comparison = parseMemoryToBytes(a.memory_usage) - parseMemoryToBytes(b.memory_usage);
          break;
        case 'memory_percent':
          comparison = a.memory_percent - b.memory_percent;
          break;
        case 'network':
          const aNet = parseNetworkToBytes(a.network_rx) + parseNetworkToBytes(a.network_tx);
          const bNet = parseNetworkToBytes(b.network_rx) + parseNetworkToBytes(b.network_tx);
          comparison = aNet - bNet;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [stats, filter, sortField, sortDirection]);

  const runningCount = useMemo(() => stats.filter(isContainerRunning).length, [stats]);

  const getSortIndicator = (field: StatsSortField) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const handleContainerClick = (stat: ContainerStat) => {
    setSelectedContainer(selectedContainer?.id === stat.id ? null : stat);
  };

  return (
    <div className="container-stats">
      <div className="stats-header">
        <h2>Resource Monitor</h2>
        <div className="header-controls">
          <select
            className="host-select"
            value={selectedHost}
            onChange={(e) => handleHostChange(e.target.value)}
          >
            {hosts.map((host) => (
              <option key={host.host} value={host.host}>
                {host.host}
              </option>
            ))}
          </select>
          <button
            className={`control-btn ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            Auto: {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button
            className="refresh-btn"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">Failed to fetch container stats</div>
      )}

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.length})
          </button>
          <button
            className={`filter-btn ${filter === 'running' ? 'active' : ''}`}
            onClick={() => setFilter('running')}
          >
            Running ({runningCount})
          </button>
        </div>
      </div>

      <div className="stats-table">
        <div className="stats-table-header">
          <div className="col-status">Status</div>
          <div
            className={`col-name sortable ${sortField === 'name' ? 'active' : ''}`}
            onClick={() => handleSort('name')}
          >
            Name{getSortIndicator('name')}
          </div>
          <div
            className={`col-cpu sortable ${sortField === 'cpu_percent' ? 'active' : ''}`}
            onClick={() => handleSort('cpu_percent')}
          >
            CPU{getSortIndicator('cpu_percent')}
          </div>
          <div
            className={`col-mem sortable ${sortField === 'memory_usage' ? 'active' : ''}`}
            onClick={() => handleSort('memory_usage')}
          >
            MEM{getSortIndicator('memory_usage')}
          </div>
          <div
            className={`col-mem-pct sortable ${sortField === 'memory_percent' ? 'active' : ''}`}
            onClick={() => handleSort('memory_percent')}
          >
            MEM %{getSortIndicator('memory_percent')}
          </div>
          <div
            className={`col-network sortable ${sortField === 'network' ? 'active' : ''}`}
            onClick={() => handleSort('network')}
          >
            NET RX / TX{getSortIndicator('network')}
          </div>
        </div>

        <div className="stats-table-body">
          {filteredAndSortedStats.map((stat) => (
            <div
              key={stat.id}
              className={`stats-table-row ${selectedContainer?.id === stat.id ? 'selected' : ''}`}
              onClick={() => handleContainerClick(stat)}
            >
              <div className="col-status">
                <span className="status-icon">
                  {getStatusIcon(stat.cpu_percent, stat.memory_percent)}
                </span>
              </div>
              <div className="col-name" title={stat.name}>{stat.name}</div>
              <div className="col-cpu">{stat.cpu_percent.toFixed(2)}%</div>
              <div className="col-mem">{stat.memory_usage}</div>
              <div className="col-mem-pct">{stat.memory_percent.toFixed(2)}%</div>
              <div className="col-network">
                {stat.network_rx} / {stat.network_tx}
              </div>
            </div>
          ))}

          {!isLoading && filteredAndSortedStats.length === 0 && (
            <div className="empty-state">
              {filter === 'running' ? 'No running containers' : 'No containers found'}
            </div>
          )}
        </div>
      </div>

      <div className="stats-summary">
        Showing {filteredAndSortedStats.length} of {stats.length} containers
      </div>

      {selectedContainer && (
        <div className="trend-section">
          <div className="trend-header">
            <h3>Resource Trend - {selectedContainer.name}</h3>
            <div className="time-range-selector">
              <button
                className={`time-btn ${timeRange === '1h' ? 'active' : ''}`}
                onClick={() => setTimeRange('1h')}
              >
                1 Hour
              </button>
              <button
                className={`time-btn ${timeRange === '30m' ? 'active' : ''}`}
                onClick={() => setTimeRange('30m')}
              >
                30 Min
              </button>
              <button
                className={`time-btn ${timeRange === '10m' ? 'active' : ''}`}
                onClick={() => setTimeRange('10m')}
              >
                10 Min
              </button>
              <button
                className={`time-btn ${timeRange === '1m' ? 'active' : ''}`}
                onClick={() => setTimeRange('1m')}
              >
                1 Min
              </button>
            </div>
          </div>
          <StatsTrendChart
            containerId={selectedContainer.id}
            timeRange={timeRange}
          />
        </div>
      )}
    </div>
  );
}
