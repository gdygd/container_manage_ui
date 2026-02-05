export type DockerEventType = 'container' | 'network' | 'image' | 'volume' | 'daemon';

export interface DockerEvent {
  id: string;
  host: string;
  type: DockerEventType;
  action: string;
  actor_id: string;
  actor_name: string;
  timestamp: number;
  attrs: Record<string, string>;
}

export type EventTypeFilter = 'all' | DockerEventType;

export interface EventCounts {
  all: number;
  container: number;
  network: number;
  image: number;
  volume: number;
  daemon: number;
}
