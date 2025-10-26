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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            {/* Logo MGC dans un carré arrondi */}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-yellow-500/20">
              <img 
                src="/logo-mgc.png" 
                alt="MGC Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            
            {/* Titre et nom */}
            <div>
              <h1 className="text-sm font-bold text-white">Courtier Gestion Pro</h1>
              {profile && (
                <p className="text-xs text-white/50">{profile.nom}</p>
              )}
            </div>
          </div>
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
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/5"
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
