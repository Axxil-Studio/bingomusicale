import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/contexts/GameContext";

export default function JoinGame() {
  const navigate = useNavigate();
  const { game, joinGame } = useGame();
  const [gameCode, setGameCode] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    setError("");
    
    if (!gameCode.trim() || !ticketNumber.trim()) {
      setError("Inserisci il codice partita e il numero del biglietto");
      return;
    }

    const ticketId = `ticket-${ticketNumber.trim()}`;
    const ticket = joinGame(gameCode.toUpperCase().trim(), ticketId);
    
    if (ticket) {
      navigate(`/play/${gameCode.toUpperCase()}/${ticketId}`);
    } else {
      setError("Partita o biglietto non trovato");
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Unisciti alla partita
        </h1>
      </div>

      {/* Form */}
      <motion.div
        className="flex-1 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center mb-8">
            <Search className="w-12 h-12 mx-auto text-primary mb-4" />
            <p className="text-muted-foreground font-body">
              Inserisci il codice della partita e il numero del tuo biglietto
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameCode" className="font-body font-medium">
                Codice partita
              </Label>
              <Input
                id="gameCode"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="Es: ABC123"
                className="h-14 text-2xl text-center font-display tracking-widest uppercase"
                maxLength={6}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketNumber" className="font-body font-medium">
                Numero biglietto
              </Label>
              <Input
                id="ticketNumber"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Es: 5"
                className="h-14 text-2xl text-center font-display"
                maxLength={2}
                inputMode="numeric"
              />
            </div>
          </div>

          {error && (
            <motion.p
              className="text-destructive text-center font-body text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <Button
            variant="golden"
            size="xl"
            className="w-full"
            onClick={handleJoin}
            disabled={!gameCode.trim() || !ticketNumber.trim()}
          >
            Entra
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {game && (
            <p className="text-center text-sm text-muted-foreground">
              Partita attiva: <span className="font-semibold">{game.name}</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
