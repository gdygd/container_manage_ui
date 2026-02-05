import { useHosts } from '../hooks';
import type { ParsedAddress, Host } from '../types';

function parseAddress(addr: string): ParsedAddress {
  const match = addr.match(/tcp:\/\/([^:]+):(\d+)/);
  if (match) {
    return { ip: match[1], port: match[2] };
  }
  return { ip: addr, port: '-' };
}

export function HostList() {
  const { data: hosts = [], isLoading, error, refetch } = useHosts();

  return (
    <div className="host-list">
      <div className="list-header">
        <h2>Docker Hosts</h2>
        <button className="refresh-btn" onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          Failed to fetch hosts
        </div>
      )}

      <div className="list-table">
        <div className="table-header">
          <div className="col-status">Status</div>
          <div className="col-host">Host Name</div>
          <div className="col-ip">IP Address</div>
          <div className="col-port">Port</div>
          <div className="col-actions">Actions</div>
        </div>

        {hosts.map((host: Host) => {
          const { ip, port } = parseAddress(host.addr);
          return (
            <div key={host.host} className="table-row">
              <div className="col-status">
                <span className="status-indicator online"></span>
              </div>
              <div className="col-host">{host.host}</div>
              <div className="col-ip">{ip}</div>
              <div className="col-port">{port}</div>
              <div className="col-actions">
                <button className="action-btn connect">Connect</button>
                <button className="action-btn info">Info</button>
              </div>
            </div>
          );
        })}

        {!isLoading && hosts.length === 0 && (
          <div className="empty-state">No hosts found</div>
        )}
      </div>

      <div className="host-summary">
        Total Hosts: {hosts.length}
      </div>
    </div>
  );
}
