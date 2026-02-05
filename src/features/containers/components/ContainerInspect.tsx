import type { InspectData } from '../types';
import { formatDate } from '../../../utils/format';

interface ContainerInspectProps {
  data: InspectData | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function ContainerInspect({ data, loading, error, onClose }: ContainerInspectProps) {
  if (!data && !loading && !error) return null;

  return (
    <div className="inspect-overlay" onClick={onClose}>
      <div className="inspect-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inspect-header">
          <h2>Container Inspect</h2>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>

        {loading && (
          <div className="inspect-loading">Loading...</div>
        )}

        {error && (
          <div className="inspect-error">{error}</div>
        )}

        {data && (
          <div className="inspect-content">
            <section className="inspect-section">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">ID:</span>
                  <span className="info-value mono">{data.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{data.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Image:</span>
                  <span className="info-value mono">{data.image}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Platform:</span>
                  <span className="info-value">{data.platform}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Created:</span>
                  <span className="info-value">{formatDate(data.created)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Restart Count:</span>
                  <span className="info-value">{data.restart_count}</span>
                </div>
              </div>
            </section>

            <section className="inspect-section">
              <h3>State</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={`status-badge ${data.state.running ? 'running' : 'stopped'}`}>
                    {data.state.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Running:</span>
                  <span className={`bool-value ${data.state.running ? 'true' : 'false'}`}>
                    {data.state.running ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Paused:</span>
                  <span className={`bool-value ${data.state.paused ? 'true' : 'false'}`}>
                    {data.state.paused ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Exit Code:</span>
                  <span className="info-value">{data.state.exit_code}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Started At:</span>
                  <span className="info-value">{formatDate(data.state.started_at)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Finished At:</span>
                  <span className="info-value">{formatDate(data.state.finished_at)}</span>
                </div>
              </div>
            </section>

            <section className="inspect-section">
              <h3>Configuration</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Hostname:</span>
                  <span className="info-value">{data.config.hostname || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">User:</span>
                  <span className="info-value">{data.config.user || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Working Dir:</span>
                  <span className="info-value">{data.config.working_dir || '-'}</span>
                </div>
              </div>

              {data.config.cmd && data.config.cmd.length > 0 && (
                <div className="config-block">
                  <span className="config-label">Command:</span>
                  <code className="config-code">{data.config.cmd.join(' ')}</code>
                </div>
              )}

              {data.config.entrypoint && data.config.entrypoint.length > 0 && (
                <div className="config-block">
                  <span className="config-label">Entrypoint:</span>
                  <code className="config-code">{data.config.entrypoint.join(' ')}</code>
                </div>
              )}

              {data.config.env && data.config.env.length > 0 && (
                <div className="config-block">
                  <span className="config-label">Environment Variables:</span>
                  <div className="env-list">
                    {data.config.env.map((env, idx) => (
                      <code key={idx} className="env-item">{env}</code>
                    ))}
                  </div>
                </div>
              )}

              {data.config.labels && Object.keys(data.config.labels).length > 0 && (
                <div className="config-block">
                  <span className="config-label">Labels:</span>
                  <div className="labels-list">
                    {Object.entries(data.config.labels).map(([key, value], idx) => (
                      <div key={idx} className="label-item">
                        <span className="label-key">{key}:</span>
                        <span className="label-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="inspect-section">
              <h3>Network</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">IP Address:</span>
                  <span className="info-value mono">{data.network.ip_address || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gateway:</span>
                  <span className="info-value mono">{data.network.gateway || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">MAC Address:</span>
                  <span className="info-value mono">{data.network.mac_address || '-'}</span>
                </div>
              </div>

              {data.network.ports && Object.keys(data.network.ports).length > 0 && (
                <div className="config-block">
                  <span className="config-label">Port Mappings:</span>
                  <table className="ports-table">
                    <thead>
                      <tr>
                        <th>Container Port</th>
                        <th>Host IP</th>
                        <th>Host Port</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data.network.ports).map(([containerPort, bindings]) =>
                        bindings.map((binding, idx) => (
                          <tr key={`${containerPort}-${idx}`}>
                            <td>{containerPort}</td>
                            <td>{binding.host_ip}</td>
                            <td>{binding.host_port}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {data.network.networks && Object.keys(data.network.networks).length > 0 && (
                <div className="config-block">
                  <span className="config-label">Networks:</span>
                  <div className="networks-list">
                    {Object.entries(data.network.networks).map(([name, network], idx) => (
                      <div key={idx} className="network-card">
                        <div className="network-name">{name}</div>
                        <div className="network-details">
                          <span>IP: {network.ip_address}</span>
                          <span>Gateway: {network.gateway}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {data.mounts && data.mounts.length > 0 && (
              <section className="inspect-section">
                <h3>Mounts</h3>
                <div className="mounts-list">
                  {data.mounts.map((mount, idx) => (
                    <div key={idx} className="mount-item">
                      <div className="mount-header">
                        <span className={`mount-type ${mount.type}`}>{mount.type}</span>
                        <span className={`mount-mode ${mount.rw ? 'rw' : 'ro'}`}>
                          {mount.rw ? 'RW' : 'RO'}
                        </span>
                      </div>
                      <div className="mount-paths">
                        <div className="mount-path">
                          <span className="path-label">Source:</span>
                          <span className="path-value">{mount.source}</span>
                        </div>
                        <div className="mount-arrow">↓</div>
                        <div className="mount-path">
                          <span className="path-label">Destination:</span>
                          <span className="path-value">{mount.destination}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
