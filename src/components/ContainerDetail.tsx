import './ContainerDetail.css';

function ContainerDetail() {
  // Mock data for layout
  const containerInfo = {
    id: 'abc123def456',
    name: 'web-server',
    image: 'nginx:latest',
    status: 'running',
    created: '2025-01-26T10:30:00Z',
    ports: [
      { host: '8080', container: '80', protocol: 'tcp' },
      { host: '8443', container: '443', protocol: 'tcp' },
    ],
    volumes: [
      { host: '/var/www/html', container: '/usr/share/nginx/html' },
    ],
    env: [
      'NGINX_HOST=localhost',
      'NGINX_PORT=80',
    ],
    networks: ['bridge', 'custom-network'],
  };

  return (
    <div className="container-detail">
      <div className="detail-header">
        <h2>Container Detail</h2>
        <button className="close-btn">Close</button>
      </div>

      <div className="detail-content">
        <section className="detail-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{containerInfo.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{containerInfo.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Image:</span>
              <span className="info-value">{containerInfo.image}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`status-badge ${containerInfo.status}`}>
                {containerInfo.status}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Created:</span>
              <span className="info-value">{containerInfo.created}</span>
            </div>
          </div>
        </section>

        <section className="detail-section">
          <h3>Port Mappings</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Host Port</th>
                  <th>Container Port</th>
                  <th>Protocol</th>
                </tr>
              </thead>
              <tbody>
                {containerInfo.ports.map((port, idx) => (
                  <tr key={idx}>
                    <td>{port.host}</td>
                    <td>{port.container}</td>
                    <td>{port.protocol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="detail-section">
          <h3>Volumes</h3>
          <div className="list-items">
            {containerInfo.volumes.map((volume, idx) => (
              <div key={idx} className="list-item">
                <span className="volume-host">{volume.host}</span>
                <span className="arrow">→</span>
                <span className="volume-container">{volume.container}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h3>Environment Variables</h3>
          <div className="list-items">
            {containerInfo.env.map((env, idx) => (
              <div key={idx} className="list-item env-item">
                {env}
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h3>Networks</h3>
          <div className="list-items">
            {containerInfo.networks.map((network, idx) => (
              <div key={idx} className="list-item network-item">
                {network}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContainerDetail;
