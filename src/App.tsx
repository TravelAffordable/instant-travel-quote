import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SocialAds from "./pages/SocialAds";
import BuildPackage from "./pages/BuildPackage";
import RateAdmin from "./pages/RateAdmin";
import ImageCompare from "./pages/ImageCompare";
import SchoolTrips from "./pages/SchoolTrips";
import BusHirePage from "./pages/BusHirePage";
import HotelProviderPage from "./pages/HotelProviderPage";
import TravelAgentPage from "./pages/TravelAgentPage";
import DurbanPremiumCalendars from "./pages/DurbanPremiumCalendars";
import DestinationPage from "./pages/DestinationPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ads" element={<SocialAds />} />
          <Route path="/build-package" element={<BuildPackage />} />
          <Route path="/rate-admin" element={<RateAdmin />} />
          <Route path="/compare/harties/budget/2-sleeper/8" element={<ImageCompare />} />
          <Route path="/school-trips" element={<SchoolTrips />} />
          <Route path="/bus-hire" element={<BusHirePage />} />
          <Route path="/hotel-provider" element={<HotelProviderPage />} />
          <Route path="/travel-agent" element={<TravelAgentPage />} />
          <Route path="/durban-premium-calendars" element={<DurbanPremiumCalendars />} />
          <Route path="/premium-live-calendars" element={<DurbanPremiumCalendars />} />
          <Route path="/destinations/:slug" element={<DestinationPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
