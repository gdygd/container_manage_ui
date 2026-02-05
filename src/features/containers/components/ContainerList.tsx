import { useState, useMemo, useCallback } from 'react';
import { useContainers, useStartContainer, useStopContainer, useContainerInspect } from '../hooks';
import { useHosts } from '../../hosts';
import { ContainerInspect } from './ContainerInspect';
import type { StateFilter, Container } from '../types';

function getStateClass(state: string): string {
  switch (state) {
    case 'running':
      return 'running';
    case 'exited':
      return 'stopped';
    case 'paused':
      return 'paused';
    default:
      return 'stopped';
  }
}

export function ContainerList() {
  const [selectedHost, setSelectedHost] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [inspectContainerId, setInspectContainerId] = useState<string | null>(null);

  const { data: hosts = [] } = useHosts();
  const { data: containers = [], isLoading, error, refetch } = useContainers(selectedHost);
  const { data: inspectData, isLoading: inspectLoading, error: inspectError } = useContainerInspect(
    selectedHost,
    inspectContainerId
  );
  const startMutation = useStartContainer();
  const stopMutation = useStopContainer();

  const handleHostChange = useCallback((host: string) => {
    setSelectedHost(host);
  }, []);

  if (hosts.length > 0 && !selectedHost) {
    handleHostChange(hosts[0].host);
  }

  const filteredContainers = useMemo(() => {
    if (stateFilter === 'all') return containers;
    return containers.filter((container: Container) => container.state === stateFilter);
  }, [containers, stateFilter]);

  const counts = useMemo(() => ({
    all: containers.length,
    running: containers.filter((c: Container) => c.state === 'running').length,
    exited: containers.filter((c: Container) => c.state === 'exited').length,
  }), [containers]);

  const handleStart = async (containerId: string) => {
    await startMutation.mutateAsync({ id: containerId, host: selectedHost });
  };

  const handleStop = async (containerId: string) => {
    await stopMutation.mutateAsync({ id: containerId, host: selectedHost });
  };

  const closeInspect = () => {
    setInspectContainerId(null);
  };

  const actionLoadingId = startMutation.isPending || stopMutation.isPending
    ? (startMutation.variables?.id || stopMutation.variables?.id)
    : null;

  return (
    <div className="container-list">
      <div className="list-header">
        <h2>Containers</h2>
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
            className="refresh-btn"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">Failed to fetch containers</div>
      )}

      <div className="filter-bar">
        <span className="filter-label">State:</span>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${stateFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStateFilter('all')}
          >
            All ({counts.all})
          </button>
          <button
            className={`filter-btn ${stateFilter === 'running' ? 'active' : ''}`}
            onClick={() => setStateFilter('running')}
          >
            Running ({counts.running})
          </button>
          <button
            className={`filter-btn ${stateFilter === 'exited' ? 'active' : ''}`}
            onClick={() => setStateFilter('exited')}
          >
            Exited ({counts.exited})
          </button>
        </div>
      </div>

      <div className="list-table">
        <div className="table-header">
          <div className="col-id">ID</div>
          <div className="col-name">Name</div>
          <div className="col-image">Image</div>
          <div className="col-status">State</div>
          <div className="col-created">Status</div>
          <div className="col-actions">Actions</div>
        </div>

        {filteredContainers.map((container: Container) => (
          <div key={container.id} className="table-row">
            <div className="col-id">{container.id.substring(0, 12)}</div>
            <div className="col-name">{container.name}</div>
            <div className="col-image">{container.image}</div>
            <div className="col-status">
              <span className={`status-badge ${getStateClass(container.state)}`}>
                {container.state}
              </span>
            </div>
            <div className="col-created">{container.status}</div>
            <div className="col-actions">
              <button
                className="action-btn start"
                disabled={container.state === 'running' || actionLoadingId === container.id}
                onClick={() => handleStart(container.id)}
              >
                {actionLoadingId === container.id ? 'Starting...' : 'Start'}
              </button>
              <button
                className="action-btn stop"
                disabled={container.state === 'exited' || actionLoadingId === container.id}
                onClick={() => handleStop(container.id)}
              >
                {actionLoadingId === container.id ? 'Stopping...' : 'Stop'}
              </button>
              <button
                className="action-btn inspect"
                onClick={() => setInspectContainerId(container.id)}
              >
                Inspect
              </button>
            </div>
          </div>
        ))}

        {!isLoading && filteredContainers.length === 0 && !error && (
          <div className="empty-state">
            {stateFilter === 'all' ? 'No containers found' : `No ${stateFilter} containers`}
          </div>
        )}
      </div>

      <div className="container-summary">
        Showing {filteredContainers.length} of {containers.length} containers
      </div>

      {(inspectData || inspectLoading || inspectError) && (
        <ContainerInspect
          data={inspectData ?? null}
          loading={inspectLoading}
          error={inspectError ? 'Failed to load inspect data' : null}
          onClose={closeInspect}
        />
      )}
    </div>
  );
}
