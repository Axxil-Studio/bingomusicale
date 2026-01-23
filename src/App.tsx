import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import Home from "./pages/Home";
import JoinGame from "./pages/JoinGame";
import GameSetup from "./pages/GameSetup";
import HostDashboard from "./pages/HostDashboard";
import PlayerTicket from "./pages/PlayerTicket";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/join" element={<JoinGame />} />
            <Route path="/host/setup/:gameId" element={<GameSetup />} />
            <Route path="/host/:gameId" element={<HostDashboard />} />
            <Route path="/play/:gameId/:ticketId" element={<PlayerTicket />} />
            <Route path="/play/:gameId/ticket-:ticketId" element={<PlayerTicket />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
