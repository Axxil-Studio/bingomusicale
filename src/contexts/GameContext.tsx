import { useState, createContext, useContext, useCallback, useEffect, useRef } from "react";
import { Game, Ticket, CustomPlaylist, createGame, drawNumber, getSongForNumber, checkWinner } from "@/lib/gameUtils";
import { gameWebSocket } from "@/lib/websocket";

interface GameContextType {
  game: Game | null;
  currentTicket: Ticket | null;
  customPlaylist: CustomPlaylist;
  setCurrentTicket: (ticket: Ticket | null) => void;
  setCustomPlaylist: (playlist: CustomPlaylist) => void;
  createNewGame: (name: string, ticketCount: number, ticketSize?: 5 | 10 | 15) => Game;
  drawNextNumber: () => { number: number; song: { title: string; artist: string } } | null;
  joinGame: (gameCode: string, ticketId: string) => Ticket | null;
  getMarkedNumbers: (ticket: Ticket) => number[];
  isTicketWinner: (ticket: Ticket) => boolean;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game | null>(null);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [customPlaylist, setCustomPlaylist] = useState<CustomPlaylist>({});
  const wsInitialized = useRef(false);

  // Инициализация WebSocket слушателей
  useEffect(() => {
    if (wsInitialized.current) return;
    wsInitialized.current = true;

    const handleGameUpdate = (gameData: Game) => {
      setGame(prevGame => {
        // Обновляем currentTicket если он был установлен
        setCurrentTicket(prevTicket => {
          if (prevTicket) {
            const updatedTicket = gameData.tickets.find(t => t.id === prevTicket.id);
            return updatedTicket || prevTicket;
          }
          return prevTicket;
        });
        
        return gameData;
      });
    };

    gameWebSocket.on('game-state', handleGameUpdate);

    gameWebSocket.on('number-drawn', ({ number, game: gameData }: { number: number; game: Game }) => {
      handleGameUpdate(gameData);
    });

    gameWebSocket.on('game-updated', handleGameUpdate);

    gameWebSocket.on('error', ({ message }: { message: string }) => {
      console.error('WebSocket ошибка:', message);
    });

    return () => {
      // Не отключаемся полностью, так как могут быть другие компоненты
      // gameWebSocket.disconnect();
      wsInitialized.current = false;
    };
  }, []);

  const createNewGame = useCallback((name: string, ticketCount: number, ticketSize: 5 | 10 | 15 = 15) => {
    const newGame = createGame(name, ticketCount, ticketSize, Object.keys(customPlaylist).length > 0 ? customPlaylist : undefined);
    setGame(newGame);
    
    // Подключаемся к WebSocket как хост и создаем игру на сервере
    // Сначала подключаемся, затем создаем игру
    gameWebSocket.connect(newGame.id, 'host', true);
    
    // Небольшая задержка для установки соединения
    setTimeout(() => {
      gameWebSocket.createGame(
        newGame.id,
        newGame.name,
        newGame.hostId,
        newGame.totalTickets,
        newGame.ticketSize,
        newGame.tickets,
        newGame.customPlaylist
      );
    }, 100);
    
    return newGame;
  }, [customPlaylist]);

  const drawNextNumber = useCallback(() => {
    if (!game || game.status === 'finished') return null;

    // Отправляем запрос на сервер через WebSocket
    // Сервер сам вытянет число и обновит состояние
    gameWebSocket.drawNumber();

    // Возвращаем null, так как обновление придет через WebSocket
    return null;
  }, [game]);

  const joinGame = useCallback((gameCode: string, ticketId: string) => {
    // Подключаемся к игре через WebSocket
    gameWebSocket.connect(gameCode, ticketId, false);
    
    // Если игра уже есть в контексте, возвращаем билет
    if (game && game.id === gameCode) {
      const ticket = game.tickets.find(t => t.id === ticketId);
      if (ticket) {
        setCurrentTicket(ticket);
        return ticket;
      }
    }
    
    // Иначе ждем обновления через WebSocket
    return null;
  }, [game]);

  const getMarkedNumbers = useCallback((ticket: Ticket) => {
    if (!game) return [];
    return ticket.flatNumbers.filter(n => game.drawnNumbers.includes(n));
  }, [game]);

  const isTicketWinner = useCallback((ticket: Ticket) => {
    if (!game) return false;
    return checkWinner(ticket, game.drawnNumbers);
  }, [game]);

  const resetGame = useCallback(() => {
    setGame(null);
    setCurrentTicket(null);
  }, []);

  return (
    <GameContext.Provider value={{
      game,
      currentTicket,
      customPlaylist,
      setCurrentTicket,
      setCustomPlaylist,
      createNewGame,
      drawNextNumber,
      joinGame,
      getMarkedNumbers,
      isTicketWinner,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
