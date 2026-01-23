import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberBallProps {
  number: number;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10 text-lg",
  md: "w-14 h-14 text-2xl",
  lg: "w-20 h-20 text-4xl",
  xl: "w-32 h-32 text-6xl",
};

export function NumberBall({ number, size = "md", animate = false, className }: NumberBallProps) {
  const Component = animate ? motion.div : "div";
  
  return (
    <Component
      className={cn(
        "flex items-center justify-center rounded-full font-display font-bold",
        "bg-gradient-gold text-primary-foreground",
        "shadow-glow border-4 border-accent/50",
        sizeClasses[size],
        className
      )}
      {...(animate ? {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0 },
        transition: { type: "spring", stiffness: 200, damping: 15 }
      } : {})}
    >
      {number}
    </Component>
  );
}
