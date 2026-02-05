import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from 'react';
import { API_BASE_URL } from '../api/config';

export interface DockerEvent {
  id: string;
  host: string;
  type: 'container' | 'network' | 'image' | 'volume' | 'daemon';
  action: string;
  actor_id: string;
  actor_name: string;
  timestamp: number;
  attrs: Record<string, string>;
}

interface EventContextType {
  events: DockerEvent[];
  isConnected: boolean;
  clearEvents: () => void;
  connect: () => void;
  disconnect: () => void;
}

const EventContext = createContext<EventContextType | null>(null);

const MAX_EVENTS = 500;

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<DockerEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const eventIdRef = useRef(0);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('[SSE] Disconnecting...');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      console.log('[SSE] Disconnected');
    }
  }, []);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('[SSE] Already connected, disconnecting first...');
      disconnect();
    }

    const url = `${API_BASE_URL}/docker-sse/events`;
    console.log('[SSE] Connecting to:', url);

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[SSE] Connection opened');
      setIsConnected(true);
    };

    eventSource.onmessage = (e) => {
      console.log('[SSE] Message received:', e.data);
    };

    eventSource.addEventListener('container-event', (e) => {
      console.log('[SSE] container-event received:', e.data);
      try {
        const data = JSON.parse(e.data);
        const newEvent: DockerEvent = {
          id: `event-${eventIdRef.current++}`,
          host: data.host,
          type: data.type,
          action: data.action,
          actor_id: data.actor_id,
          actor_name: data.actor_name,
          timestamp: data.timestamp,
          attrs: data.attrs || {},
        };
        setEvents(prev => {
          const updated = [newEvent, ...prev];
          return updated.slice(0, MAX_EVENTS);
        });
      } catch (err) {
        console.error('[SSE] Failed to parse event:', err);
      }
    });

    eventSource.onerror = (e) => {
      console.error('[SSE] Error:', e);
      console.log('[SSE] ReadyState:', eventSource.readyState);
      setIsConnected(false);
    };
  }, [disconnect]);

  return (
    <EventContext.Provider value={{ events, isConnected, clearEvents, connect, disconnect }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
