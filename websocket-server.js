import { WebSocketServer, WebSocket } from 'ws';

const server = new WebSocketServer({ port: 8080 });

const clients = new Set();

server.on('connection', (socket) => {
  clients.add(socket);

  socket.on('message', (message) => {
    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(message);
      }
    }
  });

  socket.on('close', () => {
    clients.delete(socket);
  });

  socket.on('error', error => {
    console.error('WebSocket error:', error);
    clients.delete(socket);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
