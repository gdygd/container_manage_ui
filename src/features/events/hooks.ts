import { useCallback, useRef, useState } from 'react';
import { create } from 'zustand';
import type { DockerEvent } from './types';
import { API_BASE_URL } from '../../api/http';

const MAX_EVENTS = 500;

interface EventState {
  events: DockerEvent[];
  isConnected: boolean;
}

interface EventActions {
  addEvent: (event: DockerEvent) => void;
  clearEvents: () => void;
  setConnected: (connected: boolean) => void;
}

export const useEventStore = create<EventState & EventActions>((set) => ({
  events: [],
  isConnected: false,

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, MAX_EVENTS),
    })),

  clearEvents: () => set({ events: [] }),
  setConnected: (connected) => set({ isConnected: connected }),
}));

export function useEventStream() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const eventIdRef = useRef(0);
  const { addEvent, clearEvents, setConnected, events, isConnected } = useEventStore();
  const [isPaused, setIsPaused] = useState(false);
  const [pausedEvents, setPausedEvents] = useState<DockerEvent[]>([]);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `${API_BASE_URL}/docker-sse/events`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.addEventListener('container-event', (e) => {
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
        addEvent(newEvent);
      } catch (err) {
        console.error('[SSE] Failed to parse event:', err);
      }
    });

    eventSource.onerror = () => {
      setConnected(false);
    };
  }, [addEvent, setConnected]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setConnected(false);
    }
  }, [setConnected]);

  const handlePause = useCallback(() => {
    if (!isPaused) {
      setPausedEvents([...events]);
    }
    setIsPaused(!isPaused);
  }, [isPaused, events]);

  const handleClear = useCallback(() => {
    clearEvents();
    setPausedEvents([]);
  }, [clearEvents]);

  const displayEvents = isPaused ? pausedEvents : events;

  return {
    events: displayEvents,
    isConnected,
    isPaused,
    connect,
    disconnect,
    handlePause,
    handleClear,
    setIsPaused,
  };
}
