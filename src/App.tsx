import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Materi from "./pages/Materi";
import IPConfig from "./pages/ip-config";
import Simulasi from "./pages/Simulasi";
import Kuis from "./pages/Kuis";
import Hasil from "./pages/Hasil";
import SimulasiTopologi from "./pages/SimulasiTopologi";
import Kabel from "./pages/Kabel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/materi" element={<Materi />} />
            <Route path="/ip-config" element={<IPConfig />} />
            <Route path="/simulasi" element={<Simulasi />} />
            <Route path="/kuis" element={<Kuis />} />
            <Route path="/hasil" element={<Hasil />} />
            <Route path="/topologi" element={<SimulasiTopologi />} />

            {/* ROUTE BARU */}
            <Route path="/kabel" element={<Kabel />} />

            {/* CATCH ALL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;