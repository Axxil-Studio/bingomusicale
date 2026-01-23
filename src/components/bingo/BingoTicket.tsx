import { motion } from "framer-motion";
import { BingoCell } from "./BingoCell";
import { Ticket } from "@/lib/gameUtils";
import { cn } from "@/lib/utils";

interface BingoTicketProps {
  ticket: Ticket;
  markedNumbers: number[];
  currentNumber?: number | null;
  className?: string;
  showTicketId?: boolean;
  ticketSize?: 5 | 10 | 15;
}

export function BingoTicket({ 
  ticket, 
  markedNumbers, 
  currentNumber, 
  className,
  showTicketId = true,
  ticketSize = 15
}: BingoTicketProps) {
  const progress = ticket.flatNumbers.filter(n => markedNumbers.includes(n)).length;
  const expectedSize = ticketSize || ticket.flatNumbers.length;
  const isWinner = progress === expectedSize;

  return (
    <motion.div
      className={cn(
        "p-4 sm:p-6 rounded-2xl border-2",
        "bg-bingo-ticket-bg border-bingo-ticket-border shadow-card",
        isWinner && "border-success bg-success/10",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showTicketId && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-body font-medium text-muted-foreground uppercase tracking-wider">
            Biglietto #{ticket.id.split('-')[1]}
          </span>
          <span className={cn(
            "text-sm font-body font-semibold px-3 py-1 rounded-full",
            isWinner 
              ? "bg-success text-success-foreground" 
              : "bg-primary/10 text-primary"
          )}>
            {progress}/{expectedSize}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
        {ticket.numbers.flat().map((num, idx) => (
          <BingoCell
            key={idx}
            number={num}
            isMarked={num !== null && markedNumbers.includes(num)}
            isCurrent={num === currentNumber}
          />
        ))}
      </div>
      
      {isWinner && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-2xl font-display font-bold text-success">
            🎉 BINGO! 🎉
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
