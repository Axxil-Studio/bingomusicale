import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BingoCellProps {
  number: number | null;
  isMarked: boolean;
  isCurrent?: boolean;
}

export function BingoCell({ number, isMarked, isCurrent = false }: BingoCellProps) {
  if (number === null) {
    return (
      <div className="aspect-square flex items-center justify-center bg-bingo-cell-empty/50 rounded-lg" />
    );
  }

  return (
    <motion.div
      className={cn(
        "aspect-square flex items-center justify-center rounded-lg font-display font-bold text-lg sm:text-xl md:text-2xl",
        "transition-all duration-300 border-2",
        isMarked
          ? "bg-success text-success-foreground border-success shadow-lg"
          : "bg-card border-bingo-ticket-border shadow-soft",
        isCurrent && !isMarked && "animate-pulse-glow border-primary"
      )}
      initial={false}
      animate={isMarked ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {number}
    </motion.div>
  );
}
