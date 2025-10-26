import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FolderOpen, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  FileText, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { profile } = useAuth();

  // Données factices
  const statsData = {
    totalProspects: 42,
    dossiersEnCours: 28,
    commissionsEncaissees: 15600,
    commissionsAVenir: 8400,
    tauxConversion: 68,
  };

  // Graphique mensuel leads
  const leadsData = [
    { mois: 'Jan', leads: 12, conversion: 8 },
    { mois: 'Fév', leads: 15, conversion: 10 },
    { mois: 'Mar', leads: 18, conversion: 12 },
    { mois: 'Avr', leads: 22, conversion: 15 },
    { mois: 'Mai', leads: 25, conversion: 17 },
    { mois: 'Juin', leads: 32, conversion: 22 },
  ];

  // Répartition des dossiers
  const dossiersData = [
    { name: 'Acceptés', value: 15, color: '#22c55e' },
    { name: 'En cours', value: 28, color: '#3b82f6' },
    { name: 'En attente', value: 12, color: '#f59e0b' },
    { name: 'Refusés', value: 5, color: '#ef4444' },
  ];

  // Liste des derniers dossiers
  const derniersDossiers = [
    { 
      id: 1, 
      titre: 'Prêt immobilier - Marie Dubois', 
      statut: 'accepte', 
      date: 'Il y a 2h',
      montant: '320000€'
    },
    { 
      id: 2, 
      titre: 'Rachat de crédit - Jean Martin', 
      statut: 'en_analyse', 
      date: 'Il y a 5h',
      montant: '150000€'
    },
    { 
      id: 3, 
      titre: 'Financement véhicule - Sophie Bernard', 
      statut: 'documents_recus', 
      date: 'Hier',
      montant: '25000€'
    },
    { 
      id: 4, 
      titre: 'Prêt personnel - Marc Laurent', 
      statut: 'en_attente', 
      date: 'Il y a 2 jours',
      montant: '15000€'
    },
  ];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'accepte':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepté</Badge>;
      case 'en_analyse':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />En analyse</Badge>;
      case 'documents_recus':
        return <Badge className="bg-orange-100 text-orange-800"><FileText className="w-3 h-3 mr-1" />Documents reçus</Badge>;
      case 'en_attente':
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenue, {profile?.nom} ! Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Cartes de résumé */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de prospects */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de prospects
            </CardTitle>
            <Users className="h-8 w-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.totalProspects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        {/* Dossiers en cours */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dossiers en cours
            </CardTitle>
            <FolderOpen className="h-8 w-8 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.dossiersEnCours}</div>
            <p className="text-xs text-muted-foreground mt-1">
              5 en attente de documents
            </p>
          </CardContent>
        </Card>

        {/* Commissions encaissées */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commissions encaissées
            </CardTitle>
            <DollarSign className="h-8 w-8 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.commissionsEncaissees.toLocaleString('fr-FR')} €</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ce mois
            </p>
          </CardContent>
        </Card>

        {/* Taux de conversion */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de conversion
            </CardTitle>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.tauxConversion}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5% vs. mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Graphique leads et conversions mensuels */}
        <Card>
          <CardHeader>
            <CardTitle>Leads et conversions mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Leads"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversion" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique répartition dossiers */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dossiersData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dossiersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Commissions encaissées / à venir */}
      <Card>
        <CardHeader>
          <CardTitle>Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Commissions encaissées</h3>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                {statsData.commissionsEncaissees.toLocaleString('fr-FR')} €
              </div>
              <p className="text-sm text-muted-foreground">
                Ce mois-ci
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Commissions à venir</h3>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {statsData.commissionsAVenir.toLocaleString('fr-FR')} €
              </div>
              <p className="text-sm text-muted-foreground">
                En attente de validation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des derniers dossiers */}
      <Card>
        <CardHeader>
          <CardTitle>Derniers dossiers mis à jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {derniersDossiers.map((dossier) => (
              <div key={dossier.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1">
                  <h3 className="font-semibold">{dossier.titre}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-muted-foreground">{dossier.montant}</p>
                    <span className="text-muted-foreground">•</span>
                    <p className="text-sm text-muted-foreground">{dossier.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(dossier.statut)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Raccourcis vers les sections principales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/prospects">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Prospects</h3>
                  <p className="text-sm text-muted-foreground mt-1">Gérer vos prospects</p>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dossiers">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Dossiers</h3>
                  <p className="text-sm text-muted-foreground mt-1">Voir tous les dossiers</p>
                </div>
                <ArrowRight className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/commissions">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Commissions</h3>
                  <p className="text-sm text-muted-foreground mt-1">Suivre les revenus</p>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
