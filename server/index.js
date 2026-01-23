import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Хранилище игр в памяти
const games = new Map();

// WebSocket соединения по gameId
const gameConnections = new Map(); // gameId -> Set<WebSocket>

// Обработка WebSocket соединений
wss.on('connection', (ws, req) => {
  console.log('Новое WebSocket соединение');
  
  let gameId = null;
  let ticketId = null;
  let isHost = false;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'join-game':
          gameId = data.gameId;
          ticketId = data.ticketId;
          isHost = data.isHost || false;
          
          if (!gameConnections.has(gameId)) {
            gameConnections.set(gameId, new Set());
          }
          
          gameConnections.get(gameId).add(ws);
          
          // Отправляем текущее состояние игры
          const game = games.get(gameId);
          if (game) {
            ws.send(JSON.stringify({
              type: 'game-state',
              game: game
            }));
          }
          
          console.log(`Клиент присоединился к игре ${gameId}, билет: ${ticketId}, хост: ${isHost}`);
          break;
          
        case 'create-game':
          gameId = data.gameId;
          const newGame = {
            id: data.gameId,
            name: data.name,
            status: 'setup',
            hostId: data.hostId,
            createdAt: new Date().toISOString(),
            totalTickets: data.totalTickets,
            ticketSize: data.ticketSize || 15,
            currentNumber: null,
            currentSong: null,
            drawnNumbers: [],
            tickets: data.tickets,
            winnerId: null,
            customPlaylist: data.customPlaylist || {}
          };
          
          games.set(gameId, newGame);
          
          if (!gameConnections.has(gameId)) {
            gameConnections.set(gameId, new Set());
          }
          
          gameConnections.get(gameId).add(ws);
          isHost = true;
          
          console.log(`Игра создана: ${gameId}`);
          break;
          
        case 'draw-number':
          if (!isHost) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Только хост может вытягивать числа'
            }));
            return;
          }
          
          const currentGame = games.get(gameId);
          if (!currentGame || currentGame.status === 'finished') {
            return;
          }
          
          // Определяем максимальное число на основе размера билета
          const ticketSize = currentGame.ticketSize || 15;
          let maxNumber = 90;
          if (ticketSize === 5) {
            maxNumber = 29;
          } else if (ticketSize === 10) {
            maxNumber = 69;
          }
          
          // Генерируем случайное число в нужном диапазоне, которого еще нет
          const available = Array.from({ length: maxNumber }, (_, i) => i + 1)
            .filter(n => !currentGame.drawnNumbers.includes(n));
          
          if (available.length === 0) {
            return;
          }
          
          const drawnNumber = available[Math.floor(Math.random() * available.length)];
          const newDrawnNumbers = [...currentGame.drawnNumbers, drawnNumber];
          
          // Проверяем победителя
          let winnerId = null;
          let status = currentGame.status === 'setup' ? 'active' : currentGame.status;
          
          for (const ticket of currentGame.tickets) {
            const flatNumbers = ticket.flatNumbers || 
              ticket.numbers.flat().filter(n => n !== null);
            
            if (flatNumbers.every(num => newDrawnNumbers.includes(num))) {
              winnerId = ticket.id;
              status = 'finished';
              break;
            }
          }
          
          const updatedGame = {
            ...currentGame,
            status,
            currentNumber: drawnNumber,
            drawnNumbers: newDrawnNumbers,
            winnerId
          };
          
          games.set(gameId, updatedGame);
          
          // Отправляем обновление всем подключенным клиентам
          broadcastToGame(gameId, {
            type: 'number-drawn',
            number: drawnNumber,
            game: updatedGame
          });
          
          console.log(`Вытянуто число: ${drawnNumber} в игре ${gameId}`);
          break;
          
        case 'update-game':
          if (!isHost) {
            return;
          }
          
          const gameToUpdate = games.get(gameId);
          if (gameToUpdate) {
            const updated = {
              ...gameToUpdate,
              ...data.updates
            };
            games.set(gameId, updated);
            
            broadcastToGame(gameId, {
              type: 'game-updated',
              game: updated
            });
          }
          break;
      }
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Ошибка обработки сообщения'
      }));
    }
  });
  
  ws.on('close', () => {
    if (gameId && gameConnections.has(gameId)) {
      gameConnections.get(gameId).delete(ws);
      
      if (gameConnections.get(gameId).size === 0) {
        gameConnections.delete(gameId);
      }
    }
    console.log(`Клиент отключился от игры ${gameId}`);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket ошибка:', error);
  });
});

// Функция для отправки сообщения всем клиентам игры
function broadcastToGame(gameId, message) {
  const connections = gameConnections.get(gameId);
  if (!connections) return;
  
  const messageStr = JSON.stringify(message);
  connections.forEach((ws) => {
    if (ws.readyState === 1) { // WebSocket.OPEN
      ws.send(messageStr);
    }
  });
}

// REST API для получения информации об игре
app.get('/api/game/:gameId', (req, res) => {
  const game = games.get(req.params.gameId);
  if (!game) {
    return res.status(404).json({ error: 'Игра не найдена' });
  }
  res.json(game);
});

app.get('/api/game/:gameId/ticket/:ticketId', (req, res) => {
  const game = games.get(req.params.gameId);
  if (!game) {
    return res.status(404).json({ error: 'Игра не найдена' });
  }
  
  const ticket = game.tickets.find(t => t.id === req.params.ticketId);
  if (!ticket) {
    return res.status(404).json({ error: 'Билет не найден' });
  }
  
  res.json({ game, ticket });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`WebSocket сервер готов к подключениям`);
});
