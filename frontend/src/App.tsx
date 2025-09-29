// src/App.tsx (Updated)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import IndexPage from "./pages/index";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Upload from "./pages/Upload";
import MapView from "./pages/MapView";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthContext

const queryClient = new QueryClient();

// PrivateRoute component for restricted pages
const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  const { user } = useAuth();
  // Redirect to login if not authenticated
  return user ? <>{element}</> : <Navigate to="/login" replace />; 
};


const AppContent = () => {
  const { user } = useAuth();
  
  // Conditionally render the root index route
  const RootIndexElement = user ? <Home /> : <IndexPage />;

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes accessible with the layout (navbar/footer) */}
          <Route path="/" element={<Layout />}>
            {/* The root index page changes based on authentication */}
            <Route index element={RootIndexElement} /> 
            
            {/* Public/Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="admin" element={<Admin />} />

            {/* Private Routes - User must be logged in */}
            <Route path="upload" element={<PrivateRoute element={<Upload />} />} />
            <Route path="map" element={<PrivateRoute element={<MapView />} />} />
            <Route path="leaderboard" element={<PrivateRoute element={<Leaderboard />} />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* Wrap with AuthProvider */}
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;