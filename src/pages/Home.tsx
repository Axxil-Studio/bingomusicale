import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Users, Sparkles, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/contexts/GameContext";
import { PlaylistEditor } from "@/components/bingo/PlaylistEditor";

export default function Home() {
  const navigate = useNavigate();
  const { createNewGame, customPlaylist, setCustomPlaylist } = useGame();
  const [gameName, setGameName] = useState("");
  const [ticketCount, setTicketCount] = useState(10);
  const [ticketSize, setTicketSize] = useState<5 | 10 | 15>(15);
  const [isCreating, setIsCreating] = useState(false);
  const [showPlaylistEditor, setShowPlaylistEditor] = useState(false);

  const customSongCount = Object.keys(customPlaylist).length;

  const handleCreateGame = () => {
    if (!gameName.trim()) return;
    
    const game = createNewGame(gameName.trim(), ticketCount, ticketSize);
    navigate(`/host/setup/${game.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div
            className="mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Sparkles className="w-16 h-16 mx-auto text-primary mb-4" />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-4">
            <span className="text-gradient-gold">Bingo</span>{" "}
            <span className="text-foreground">Musicale</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground font-body mb-12">
            Il gioco della tombola con le canzoni italiane
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Create Game Card */}
          {!isCreating ? (
            <div className="space-y-4">
              <Button
                variant="golden"
                size="xl"
                className="w-full"
                onClick={() => setIsCreating(true)}
              >
                <Play className="w-6 h-6 mr-2" />
                Crea nuova partita
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate("/join")}
              >
                <Users className="w-5 h-5 mr-2" />
                Unisciti a una partita
              </Button>
            </div>
          ) : (
            <motion.div
              className="bg-card p-6 rounded-2xl shadow-card border border-border space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground">
                Nuova partita
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gameName" className="font-body font-medium">
                    Nome della partita
                  </Label>
                  <Input
                    id="gameName"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="Es: Serata al bar"
                    className="h-12 text-lg"
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ticketSize" className="font-body font-medium">
                    Dimensione biglietto
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={ticketSize === 5 ? "default" : "outline"}
                      onClick={() => setTicketSize(5)}
                      className="flex flex-col items-center py-10 px-6"
                    >
                      <span className="text-lg font-bold">5</span>
                      <span className="text-xs text-muted-foreground">1-29</span>
                    </Button>
                    <Button
                      type="button"
                      variant={ticketSize === 10 ? "default" : "outline"}
                      onClick={() => setTicketSize(10)}
                      className="flex flex-col items-center py-10 px-6"
                    >
                      <span className="text-lg font-bold">10</span>
                      <span className="text-xs text-muted-foreground">1-69</span>
                    </Button>
                    <Button
                      type="button"
                      variant={ticketSize === 15 ? "default" : "outline"}
                      onClick={() => setTicketSize(15)}
                      className="flex flex-col items-center py-10 px-6"
                    >
                      <span className="text-lg font-bold">15</span>
                      <span className="text-xs text-muted-foreground">1-99</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticketCount" className="font-body font-medium">
                    Numero di biglietti: {ticketCount}
                  </Label>
                  <input
                    type="range"
                    id="ticketCount"
                    min={5}
                    max={20}
                    value={ticketCount}
                    onChange={(e) => setTicketCount(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Playlist Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => setShowPlaylistEditor(true)}
                >
                  <Music className="w-5 h-5 mr-2" />
                  Playlist personalizzato
                  {customSongCount > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {customSongCount}
                    </span>
                  )}
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                  onClick={() => setIsCreating(false)}
                >
                  Annulla
                </Button>
                <Button
                  variant="golden"
                  size="lg"
                  className="flex-1"
                  onClick={handleCreateGame}
                  disabled={!gameName.trim()}
                >
                  Crea
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-muted-foreground font-body">
          Fatto con ❤️ per le serate italiane
        </p>
      </footer>

      {/* Playlist Editor Modal */}
      <AnimatePresence>
        {showPlaylistEditor && (
          <PlaylistEditor
            playlist={customPlaylist}
            onPlaylistChange={setCustomPlaylist}
            onClose={() => setShowPlaylistEditor(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
