import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Disc3, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { SongDisplay } from "@/components/bingo/SongDisplay";
import { DrawnNumbersList } from "@/components/bingo/DrawnNumbersList";
import { BingoTicket } from "@/components/bingo/BingoTicket";
import { getSongForNumber, getMaxNumberForTicketSize } from "@/lib/gameUtils";
import { gameWebSocket } from "@/lib/websocket";
import { useEffect } from "react";

export default function HostDashboard() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { game, drawNextNumber, getMarkedNumbers, resetGame } = useGame();

  // Подключаемся к игре как хост при монтировании
  useEffect(() => {
    if (!gameId || !game) return;

    // Подключаемся к WebSocket как хост
    gameWebSocket.connect(gameId, 'host', true);
    
    return () => {
      // При размонтировании отключаемся
      // gameWebSocket.disconnect();
    };
  }, [gameId, game]);

  if (!game || game.id !== gameId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Partita non trovata</p>
          <Button onClick={() => navigate("/")}>Torna alla home</Button>
        </div>
      </div>
    );
  }

  const handleDrawNumber = () => {
    drawNextNumber();
  };

  const handleEndGame = () => {
    resetGame();
    navigate("/");
  };

  const currentSong = game.currentNumber ? getSongForNumber(game.currentNumber, game.customPlaylist) : null;
  const winnerTicket = game.winnerId 
    ? game.tickets.find(t => t.id === game.winnerId) 
    : null;
  const maxNumber = getMaxNumberForTicketSize(game.ticketSize);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-foreground">
                {game.name}
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                {game.id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{game.tickets.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Disc3 className="w-4 h-4" />
              <span>{game.drawnNumbers.length}/{maxNumber}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 space-y-8">
        {/* Winner Banner */}
        {game.status === 'finished' && winnerTicket && (
          <motion.div
            className="bg-gradient-victory text-white p-6 rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-2xl font-display font-bold mb-2">
              Abbiamo un vincitore!
            </h2>
            <p className="text-white/90 font-body">
              Biglietto #{winnerTicket.id.split('-')[1]} ha fatto BINGO!
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="mt-4"
              onClick={handleEndGame}
            >
              Nuova partita
            </Button>
          </motion.div>
        )}

        {/* Current Number & Song */}
        <section className="flex justify-center">
          <SongDisplay 
            number={game.currentNumber} 
            song={currentSong}
          />
        </section>

        {/* Draw Button */}
        {game.status !== 'finished' && (
          <section className="flex justify-center">
            <Button
              variant="golden"
              size="xl"
              onClick={handleDrawNumber}
              disabled={game.drawnNumbers.length >= maxNumber}
              className="min-w-[250px]"
            >
              <Disc3 className="w-6 h-6 mr-2" />
              Estrai numero
            </Button>
          </section>
        )}

        {/* Drawn Numbers */}
        <section className="bg-card rounded-2xl p-6 shadow-soft border border-border">
          <h3 className="font-display font-semibold text-foreground mb-4 text-center">
            Numeri estratti ({game.drawnNumbers.length})
          </h3>
          <DrawnNumbersList 
            numbers={game.drawnNumbers}
            currentNumber={game.currentNumber}
            maxDisplay={20}
          />
        </section>

        {/* All Tickets Preview */}
        <section>
          <h3 className="font-display font-semibold text-foreground mb-4 text-center">
            Tutti i biglietti
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {game.tickets.map((ticket, idx) => (
              <BingoTicket
                key={ticket.id}
                ticket={ticket}
                markedNumbers={getMarkedNumbers(ticket)}
                currentNumber={game.currentNumber}
                ticketSize={game.ticketSize}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
