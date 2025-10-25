import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import EspaceClient from "./pages/EspaceClient";
import Prospects from "./pages/Prospects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function CourtierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            
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
                    <div>Dossiers</div>
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/relances"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <div>Relances</div>
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <div>Documents</div>
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/partenaires"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <div>Partenaires</div>
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/commissions"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <div>Commissions</div>
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/automatisations"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <div>Automatisations</div>
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyses"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <div>Analyses</div>
                  </CourtierLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/parametres"
              element={
                <ProtectedRoute requiredRole="courtier">
                  <CourtierLayout>
                    <div>Paramètres</div>
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
  </QueryClientProvider>
);

export default App;
