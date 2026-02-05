export interface Container {
  id: string;
  name: string;
  image: string;
  state: ContainerStateType;
  status: string;
}

export type ContainerStateType = 'running' | 'exited' | 'paused' | 'created' | 'restarting' | 'dead';

export type StateFilter = 'all' | 'running' | 'exited';

export interface ContainerState {
  status: string;
  running: boolean;
  paused: boolean;
  restarting: boolean;
  exit_code: number;
  started_at: string;
  finished_at: string;
}

export interface ContainerConfig {
  hostname: string;
  user: string;
  env: string[];
  cmd: string[];
  entrypoint: string[];
  working_dir: string;
  labels: Record<string, string>;
}

export interface PortBinding {
  host_ip: string;
  host_port: string;
}

export interface NetworkDetail {
  network_id: string;
  ip_address: string;
  gateway: string;
  mac_address: string;
}

export interface ContainerNetwork {
  ip_address: string;
  gateway: string;
  mac_address: string;
  ports: Record<string, PortBinding[]>;
  networks: Record<string, NetworkDetail>;
}

export interface Mount {
  type: string;
  name: string;
  source: string;
  destination: string;
  mode: string;
  rw: boolean;
}

export interface InspectData {
  id: string;
  name: string;
  image: string;
  created: string;
  platform: string;
  restart_count: number;
  state: ContainerState;
  config: ContainerConfig;
  network: ContainerNetwork;
  mounts: Mount[];
}

export interface ContainerActionRequest {
  id: string;
  host: string;
}

export interface ContainerStats {
  id: string;
  name: string;
  cpuPercent: number;
  memoryUsage: string;
  memoryLimit: string;
  memoryPercent: number;
  networkRx: string;
  networkTx: string;
  blockRead: string;
  blockWrite: string;
}
