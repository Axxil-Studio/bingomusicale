// WebSocket клиент для синхронизации игры

export type WebSocketMessage = 
  | { type: 'join-game'; gameId: string; ticketId: string; isHost?: boolean }
  | { type: 'create-game'; gameId: string; name: string; hostId: string; totalTickets: number; ticketSize: 5 | 10 | 15; tickets: any[]; customPlaylist?: any }
  | { type: 'draw-number' }
  | { type: 'update-game'; updates: any }
  | { type: 'game-state'; game: any }
  | { type: 'number-drawn'; number: number; game: any }
  | { type: 'game-updated'; game: any }
  | { type: 'error'; message: string };

export class GameWebSocket {
  private ws: WebSocket | null = null;
  private gameId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(private url: string = 'ws://localhost:3001') {}

  connect(gameId: string, ticketId: string, isHost: boolean = false) {
    if (this.ws?.readyState === WebSocket.OPEN && this.gameId === gameId) {
      return; // Уже подключены к этой игре
    }

    this.disconnect();
    this.gameId = gameId;

    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket подключен');
        this.reconnectAttempts = 0;
        
        // Отправляем сообщение о присоединении
        this.send({
          type: 'join-game',
          gameId,
          ticketId,
          isHost
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Ошибка парсинга сообщения:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket ошибка:', error);
        this.emit('error', { message: 'Ошибка соединения' });
      };

      this.ws.onclose = () => {
        console.log('WebSocket отключен');
        this.ws = null;
        
        // Попытка переподключения
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.gameId) {
          this.reconnectAttempts++;
          setTimeout(() => {
            if (this.gameId) {
              this.connect(this.gameId, ticketId, isHost);
            }
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };
    } catch (error) {
      console.error('Ошибка создания WebSocket:', error);
      this.emit('error', { message: 'Не удалось подключиться к серверу' });
    }
  }

  createGame(gameId: string, name: string, hostId: string, totalTickets: number, ticketSize: 5 | 10 | 15, tickets: any[], customPlaylist?: any) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('WebSocket не подключен');
      return;
    }

    this.send({
      type: 'create-game',
      gameId,
      name,
      hostId,
      totalTickets,
      ticketSize,
      tickets,
      customPlaylist
    });
  }

  drawNumber() {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('WebSocket не подключен');
      return;
    }

    this.send({ type: 'draw-number' });
  }

  updateGame(updates: any) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('WebSocket не подключен');
      return;
    }

    this.send({ type: 'update-game', updates });
  }

  private send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket не готов к отправке сообщений');
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'game-state':
        this.emit('game-state', message.game);
        break;
      case 'number-drawn':
        this.emit('number-drawn', { number: message.number, game: message.game });
        break;
      case 'game-updated':
        this.emit('game-updated', message.game);
        break;
      case 'error':
        this.emit('error', { message: message.message });
        break;
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.gameId = null;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Создаем глобальный экземпляр
export const gameWebSocket = new GameWebSocket(
  import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
);
