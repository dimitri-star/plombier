import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, TrendingUp, Users, DollarSign, Clock, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analyses() {
  const { toast } = useToast();

  // Données pour les graphiques
  const leadsData = [
    { mois: 'Oct 2023', leads: 45 },
    { mois: 'Nov 2023', leads: 52 },
    { mois: 'Déc 2023', leads: 48 },
    { mois: 'Jan 2024', leads: 61 },
    { mois: 'Fév 2024', leads: 38 },
  ];

  const conversionData = [
    { mois: 'Oct 2023', taux: 65 },
    { mois: 'Nov 2023', taux: 72 },
    { mois: 'Déc 2023', taux: 68 },
    { mois: 'Jan 2024', taux: 75 },
    { mois: 'Fév 2024', taux: 71 },
  ];

  const commissionsData = [
    { mois: 'Oct 2023', montant: 8500 },
    { mois: 'Nov 2023', montant: 10200 },
    { mois: 'Déc 2023', montant: 12350 },
    { mois: 'Jan 2024', montant: 15250 },
    { mois: 'Fév 2024', montant: 9600 },
  ];

  const partenairesRanking = [
    { nom: 'Crédit Mutuel', dossiers: 28, taux: 92, commission: 12500 },
    { nom: 'Crédit Agricole', dossiers: 22, taux: 85, commission: 10200 },
    { nom: 'BNP Paribas', dossiers: 18, taux: 78, commission: 8500 },
    { nom: 'Société Générale', dossiers: 15, taux: 70, commission: 6800 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleExport = () => {
    toast({
      title: 'Export réussi',
      description: 'Données exportées avec succès',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analyses et Statistiques</h1>
          <p className="mt-2 text-muted-foreground">
            Visualisez vos performances et résultats
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exporter les données
        </Button>
      </div>

      {/* Indicateurs clés */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">244</div>
                <p className="text-xs text-muted-foreground">Total leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">71%</div>
                <p className="text-xs text-muted-foreground">Taux de conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">9 jours</div>
                <p className="text-xs text-muted-foreground">Délai moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">72.4k €</div>
                <p className="text-xs text-muted-foreground">Revenus annuels</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#0088FE" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="taux" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution des commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="montant" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par partenaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={partenairesRanking}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nom, dossiers }) => `${nom}: ${dossiers}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="dossiers"
                >
                  {partenairesRanking.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Classement des partenaires */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <CardTitle>Classement des partenaires</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partenairesRanking.map((partenaire, index) => (
              <div
                key={partenaire.nom}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{partenaire.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      {partenaire.dossiers} dossiers • {partenaire.commission.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-100 text-green-800">
                    {partenaire.taux}% taux d'acceptation
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
