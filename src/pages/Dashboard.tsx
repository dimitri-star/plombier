import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();

  const stats = [
    {
      title: 'Prospects',
      value: '24',
      icon: Users,
      description: '+12% ce mois',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Dossiers en cours',
      value: '18',
      icon: FolderOpen,
      description: '5 en attente',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Commissions',
      value: '12 450 €',
      icon: DollarSign,
      description: 'Ce mois',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Taux de conversion',
      value: '68%',
      icon: TrendingUp,
      description: '+5% vs. mois dernier',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenue, {profile?.nom} ! Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: 'Nouveau prospect ajouté',
                name: 'Marie Dubois',
                time: 'Il y a 2 heures',
              },
              {
                action: 'Dossier accepté',
                name: 'Jean Martin',
                time: 'Il y a 5 heures',
              },
              {
                action: 'Document reçu',
                name: 'Sophie Bernard',
                time: 'Hier',
              },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.name}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
