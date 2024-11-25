interface IWebSocketService {
  addEventListener(event: keyof WebSocketEventMap, callback: (event: MessageEvent) => void): void;
  removeEventListener(event: keyof WebSocketEventMap, callback: (event: MessageEvent) => void): void;
  send(data: unknown): void;
  close(): void;
}

class WebSocketService implements IWebSocketService {
  private socket!: WebSocket;

  constructor(url: string) {
    this.connect(url);
  }

  private connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed. Attempting to reconnect...');
      setTimeout(() => this.connect(url), 5000);
    };
  }

  public addEventListener(event: keyof WebSocketEventMap, callback: (event: MessageEvent) => void): void {
    this.socket.addEventListener(event, callback as EventListener);
  }

  public removeEventListener(event: keyof WebSocketEventMap, callback: (event: MessageEvent) => void): void {
    this.socket.removeEventListener(event, callback as EventListener);
  }

  public send(data: unknown): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Message not sent.');
    }
  }

  public close(): void {
    this.socket.close();
  }
}

export default WebSocketService;
