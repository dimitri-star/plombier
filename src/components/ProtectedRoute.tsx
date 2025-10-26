import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'courtier' | 'client' | 'any';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required (and it's not 'any')
  if (requiredRole && requiredRole !== 'any' && profile.role !== requiredRole) {
    // Redirect to appropriate page based on actual role
    const redirectPath = profile.role === 'courtier' ? '/dashboard' : '/espace-client';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
