import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText,
  ClipboardList,
  Calendar,
  MessageSquare,
  Handshake,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
  { icon: ClipboardList, label: 'Devis & Relances', path: '/prospects' },
  { icon: Calendar, label: 'Planning & Interventions', path: '/dossiers' },
  { icon: MessageSquare, label: 'Messages & Suivi', path: '/documents' },
  { icon: Handshake, label: 'Clients & Historique', path: '/partenaires' },
  { icon: BarChart3, label: 'Chantiers & Photos', path: '/analyses' },
  { icon: DollarSign, label: 'Finances & Paiements', path: '/commissions' },
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
            {/* Logo Plombier avec icône clé à molette */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 border border-blue-400/30 shadow-lg shadow-blue-500/20">
              <Wrench className="h-7 w-7 text-blue-400" strokeWidth={2.5} />
            </div>
            
            {/* Titre et nom */}
            <div>
              <h1 className="text-sm font-bold text-white">Plombier IA Pro</h1>
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
