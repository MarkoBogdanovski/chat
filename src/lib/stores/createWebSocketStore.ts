import { writable, type Writable } from 'svelte/store';
import type WebSocketService from '$lib/services/WebSocketService';

interface Message {
  user: string;
  text: string;
  timestamp: number;
  key?: unknown;
}

interface WebSocketStore {
  subscribe: Writable<Message[]>['subscribe'];
  sendMessage: (message: Message) => void;
  destroy: () => void;
}

export function createWebSocketStore(wsService: WebSocketService): WebSocketStore {
  const messages: Writable<Message[]> = writable([]);

  const messageHandler = async (event: MessageEvent) => {
    try {
      let jsonString: string;
      if (event.data instanceof Blob) {
        jsonString = await event.data.text();
      } else {
        jsonString = event.data;
      }
      const data = JSON.parse(jsonString) as Message;
      messages.update(current => [...current, data]);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  wsService.addEventListener('message', messageHandler);

  return {
    subscribe: messages.subscribe,
    sendMessage: (message: Message) => {
      wsService.send(message);
    },
    destroy: () => {
      wsService.removeEventListener('message', messageHandler);
    }
  };
}
