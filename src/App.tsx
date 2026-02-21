import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecipeProvider } from "@/contexts/RecipeContext";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import AddRecipe from "./pages/AddRecipe";
import TodayMenu from "./pages/TodayMenu";
import HistoryPage from "./pages/History";
import RandomPick from "./pages/RandomPick";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RecipeProvider>
          <div className="mx-auto max-w-lg">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/add" element={<AddRecipe />} />
              <Route path="/edit/:id" element={<AddRecipe />} />
              <Route path="/today" element={<TodayMenu />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/random" element={<RandomPick />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </RecipeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
