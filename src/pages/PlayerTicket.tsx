import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Music, Trophy, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { BingoTicket } from "@/components/bingo/BingoTicket";
import { NumberBall } from "@/components/bingo/NumberBall";
import { getSongForNumber } from "@/lib/gameUtils";
import { gameWebSocket } from "@/lib/websocket";
import { useEffect, useState } from "react";

export default function PlayerTicket() {
  const { gameId, ticketId: ticketIdParam } = useParams<{ gameId: string; ticketId: string }>();
  const navigate = useNavigate();
  const { game, getMarkedNumbers, isTicketWinner, joinGame } = useGame();
  const [isConnecting, setIsConnecting] = useState(true);
  
  // Нормализуем ticketId (поддерживаем оба формата: ticket-1 и ticket-1)
  const ticketId = ticketIdParam?.startsWith('ticket-') ? ticketIdParam : `ticket-${ticketIdParam}`;

  // Подключаемся к игре через WebSocket при монтировании
  useEffect(() => {
    if (!gameId || !ticketId) return;

    setIsConnecting(true);
    
    // Подключаемся к WebSocket
    gameWebSocket.connect(gameId, ticketId, false);
    
    // Пытаемся присоединиться к игре
    const ticket = joinGame(gameId, ticketId);
    
    if (ticket) {
      setIsConnecting(false);
    } else {
      // Если билет не найден сразу, ждем обновления через WebSocket
      const timeout = setTimeout(() => {
        setIsConnecting(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [gameId, ticketId, joinGame]);

  // Показываем состояние загрузки
  if (isConnecting || !game || game.id !== gameId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <p className="text-muted-foreground mb-4">
              {isConnecting ? "Подключение к игре..." : "Игра не найдена"}
            </p>
          </motion.div>
          {!isConnecting && (
            <Button onClick={() => navigate("/join")}>Войти в игру</Button>
          )}
        </div>
      </div>
    );
  }

  const ticket = game.tickets.find(t => t.id === ticketId);
  
  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Билет не найден</p>
          <Button onClick={() => navigate("/join")}>Попробовать снова</Button>
        </div>
      </div>
    );
  }

  const markedNumbers = getMarkedNumbers(ticket);
  const isWinner = isTicketWinner(ticket);
  const currentSong = game.currentNumber ? getSongForNumber(game.currentNumber) : null;
  const isMyNumber = game.currentNumber && ticket.flatNumbers.includes(game.currentNumber);
  const ticketSize = game.ticketSize || 15;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-display font-bold text-foreground">
              {game.name}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Biglietto #{ticket.id.split('-')[1]}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 space-y-6">
        {/* Winner Celebration */}
        {isWinner && (
          <motion.div
            className="bg-gradient-victory text-white p-6 rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <PartyPopper className="w-16 h-16 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold mb-2">
              HAI VINTO!
            </h2>
            <p className="text-white/90 font-body">
              Congratulazioni! Vai dal presentatore!
            </p>
          </motion.div>
        )}

        {/* Current Number Display */}
        {game.currentNumber && !isWinner && (
          <motion.div
            key={game.currentNumber}
            className={`p-6 rounded-2xl shadow-card border text-center ${
              isMyNumber 
                ? "bg-primary/10 border-primary" 
                : "bg-card border-border"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-body text-muted-foreground mb-3 uppercase tracking-wider">
              Ultimo numero
            </p>
            
            <div className="flex justify-center mb-4">
              <NumberBall number={game.currentNumber} size="lg" animate />
            </div>
            
            {currentSong && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <Music className="w-5 h-5" />
                <span className="font-display font-semibold">
                  {currentSong.title}
                </span>
              </div>
            )}
            
            {isMyNumber && (
              <motion.p
                className="mt-4 text-lg font-display font-bold text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                🎤 È il tuo numero! Canta!
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Waiting State */}
        {!game.currentNumber && game.status !== 'finished' && (
          <div className="text-center py-8">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <p className="text-muted-foreground font-body">
                In attesa del primo numero...
              </p>
            </motion.div>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-primary">
              {markedNumbers.length}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Segnati
            </p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-foreground">
              {ticketSize - markedNumbers.length}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Mancanti
            </p>
          </div>
        </div>

        {/* Ticket */}
        <BingoTicket
          ticket={ticket}
          markedNumbers={markedNumbers}
          currentNumber={game.currentNumber}
          showTicketId={false}
          ticketSize={ticketSize}
        />

        {/* Game Status */}
        {game.status === 'finished' && !isWinner && (
          <div className="text-center py-6">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-body">
              La partita è terminata
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
