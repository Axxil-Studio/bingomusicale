import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DrawnNumbersListProps {
  numbers: number[];
  currentNumber?: number | null;
  maxDisplay?: number;
}

export function DrawnNumbersList({ 
  numbers, 
  currentNumber,
  maxDisplay = 10 
}: DrawnNumbersListProps) {
  const displayNumbers = numbers.slice(-maxDisplay).reverse();
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {displayNumbers.map((num, idx) => (
        <motion.div
          key={num}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm",
            "border-2 transition-all",
            num === currentNumber
              ? "bg-gradient-gold text-primary-foreground border-accent shadow-glow"
              : "bg-card text-foreground border-border shadow-soft"
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: idx * 0.05 }}
        >
          {num}
        </motion.div>
      ))}
      
      {numbers.length === 0 && (
        <p className="text-muted-foreground text-sm font-body">
          Nessun numero estratto
        </p>
      )}
    </div>
  );
}
