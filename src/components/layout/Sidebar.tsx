import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText,
  Handshake,
  DollarSign,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
  { icon: Users, label: 'Prospects', path: '/prospects' },
  { icon: FolderOpen, label: 'Dossiers', path: '/dossiers' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: Handshake, label: 'Partenaires', path: '/partenaires' },
  { icon: DollarSign, label: 'Commissions', path: '/commissions' },
  { icon: BarChart3, label: 'Analyses', path: '/analyses' },
  { icon: Settings, label: 'Paramètres', path: '/parametres' },
];

export function Sidebar() {
  const { profile, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b p-6">
          <h1 className="text-xl font-bold text-primary">Courtier Pro Flow</h1>
          {profile && (
            <p className="mt-1 text-sm text-muted-foreground">{profile.nom}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}
