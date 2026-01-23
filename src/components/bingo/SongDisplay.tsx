import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import { NumberBall } from "./NumberBall";

interface SongDisplayProps {
  number: number | null;
  song: { title: string; artist: string } | null;
}

export function SongDisplay({ number, song }: SongDisplayProps) {
  return (
    <AnimatePresence mode="wait">
      {number && song ? (
        <motion.div
          key={number}
          className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-card shadow-card border border-border"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <NumberBall number={number} size="xl" animate />
          
          <div className="flex items-center gap-2 text-primary">
            <Music className="w-6 h-6" />
            <span className="text-sm font-body font-medium uppercase tracking-widest">
              Canta
            </span>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              {song.title}
            </h2>
            <p className="text-lg text-muted-foreground font-body">
              {song.artist}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="waiting"
          className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-card/50 border border-dashed border-border min-h-[280px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-body text-center">
            In attesa del prossimo numero...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
