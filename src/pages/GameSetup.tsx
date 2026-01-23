import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, ArrowRight, Copy, Check, QrCode, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useState } from "react";

export default function GameSetup() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { game } = useGame();
  const [copiedTicket, setCopiedTicket] = useState<string | null>(null);

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

  const baseUrl = window.location.origin;

  const copyTicketLink = (ticketId: string) => {
    // Используем формат /play/:gameId/ticket-:ticketId
    const url = `${baseUrl}/play/${game.id}/${ticketId}`;
    navigator.clipboard.writeText(url);
    setCopiedTicket(ticketId);
    setTimeout(() => setCopiedTicket(null), 2000);
  };

  const startGame = () => {
    navigate(`/host/${game.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-display font-bold text-foreground">
            {game.name}
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Codice: {game.id}
          </p>
        </div>
        <Button
          variant="golden"
          size="sm"
          onClick={startGame}
        >
          Inizia
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Instructions */}
      <motion.div
        className="bg-card rounded-2xl p-4 mb-6 shadow-soft border border-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <QrCode className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-display font-semibold text-foreground mb-1">
              Distribuisci i biglietti
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Fai scansionare i QR code ai giocatori o condividi i link
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tickets Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {game.tickets.map((ticket, idx) => (
            <motion.div
              key={ticket.id}
              className="bg-card rounded-xl p-4 shadow-card border border-border flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <p className="text-sm font-body font-medium text-muted-foreground mb-3">
                Biglietto #{idx + 1}
              </p>
              
              <div className="bg-white p-2 rounded-lg mb-3">
                <QRCodeSVG
                  value={`${baseUrl}/play/${game.id}/${ticket.id}`}
                  size={100}
                  level="M"
                  includeMargin={false}
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => copyTicketLink(ticket.id)}
              >
                {copiedTicket === ticket.id ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-success" />
                    Copiato
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copia link
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => window.print()}
        >
          <Printer className="w-5 h-5 mr-2" />
          Stampa QR
        </Button>
        <Button
          variant="golden"
          size="lg"
          className="flex-1"
          onClick={startGame}
        >
          Inizia partita
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
