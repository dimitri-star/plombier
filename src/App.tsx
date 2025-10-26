import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlowBackground } from "@/components/ui/glow-background";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import EspaceClient from "./pages/EspaceClient";
import Prospects from "./pages/Prospects";
import Dossiers from "./pages/Dossiers";
import Documents from "./pages/Documents";
import Partenaires from "./pages/Partenaires";
import Commissions from "./pages/Commissions";
import Analyses from "./pages/Analyses";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function CourtierLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlowBackground className="min-h-screen">
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="max-w-[calc(100vw-18rem)]">{children}</div>
        </main>
      </div>
    </GlowBackground>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/welcome" 
              element={
                <ProtectedRoute requiredRole="any">
                  <Welcome />
                </ProtectedRoute>
              } 
            />
            
            {/* Routes Courtier */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <Dashboard />
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/prospects"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <Prospects />
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dossiers"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <Dossiers />
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <Documents />
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/partenaires"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <Partenaires />
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/commissions"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <Commissions />
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyses"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <Analyses />
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/parametres"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <Parametres />
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />

            {/* Route Client */}
            <Route
              path="/espace-client"
              element={
                <ProtectedRoute requiredRole="client">
                  <EspaceClient />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
