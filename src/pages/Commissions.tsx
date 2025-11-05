import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Clock, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Facture {
  id: string;
  client: string;
  montant: number;
  statut: 'Payée' | 'En attente';
  dateEmission: string;
  datePaiement?: string;
}

export default function Commissions() {
  const { toast } = useToast();

  // Données factices de factures
  const [factures, setFactures] = useState<Facture[]>([
    {
      id: 'F-101',
      client: 'Mme Colin',
      montant: 180,
      statut: 'Payée',
      dateEmission: '2024-11-06',
      datePaiement: '2024-11-07',
    },
    {
      id: 'F-102',
      client: 'M. Leroy',
      montant: 690,
      statut: 'Payée',
      dateEmission: '2024-11-06',
      datePaiement: '2024-11-08',
    },
    {
      id: 'F-100',
      client: 'M. Giraud',
      montant: 180,
      statut: 'Payée',
      dateEmission: '2024-10-02',
      datePaiement: '2024-10-05',
    },
    {
      id: 'F-103',
      client: 'M. Dubois',
      montant: 250,
      statut: 'En attente',
      dateEmission: '2024-11-07',
    },
    {
      id: 'F-104',
      client: 'M. Martin',
      montant: 450,
      statut: 'En attente',
      dateEmission: '2024-11-05',
    },
  ]);

  // Données pour les calculs mensuels
  const moisActuel = new Date().getMonth();
  const anneeActuel = new Date().getFullYear();
  
  const facturesMoisActuel = useMemo(() => {
    return factures.filter(f => {
      const date = new Date(f.dateEmission);
      return date.getMonth() === moisActuel && date.getFullYear() === anneeActuel;
    });
  }, [factures, moisActuel, anneeActuel]);

  const facturesMoisPrecedent = useMemo(() => {
    const moisPrec = moisActuel === 0 ? 11 : moisActuel - 1;
    const anneePrec = moisActuel === 0 ? anneeActuel - 1 : anneeActuel;
    return factures.filter(f => {
      const date = new Date(f.dateEmission);
      return date.getMonth() === moisPrec && date.getFullYear() === anneePrec;
    });
  }, [factures, moisActuel, anneeActuel]);

  // Calculs du résumé mensuel
  const chiffreAffaires = facturesMoisActuel
    .filter(f => f.statut === 'Payée')
    .reduce((acc, f) => acc + f.montant, 0);

  const montantEnAttente = facturesMoisActuel
    .filter(f => f.statut === 'En attente')
    .reduce((acc, f) => acc + f.montant, 0);

  // Simulation : nombre de devis et factures pour le taux de conversion
  const nombreDevis = 12; // Devis créés ce mois
  const nombreFactures = facturesMoisActuel.length; // Factures émises
  const tauxConversion = nombreDevis > 0 ? Math.round((nombreFactures / nombreDevis) * 100) : 0;

  // Calcul évolution CA
  const CAMoisPrecedent = facturesMoisPrecedent
    .filter(f => f.statut === 'Payée')
    .reduce((acc, f) => acc + f.montant, 0);

  const evolutionCA = CAMoisPrecedent > 0 
    ? Math.round(((chiffreAffaires - CAMoisPrecedent) / CAMoisPrecedent) * 100)
    : 0;

  // Données pour le graphique d'évolution du CA (6 derniers mois)
  const evolutionCAData = [
    { mois: 'Juin', CA: 2800 },
    { mois: 'Juil', CA: 3100 },
    { mois: 'Août', CA: 2950 },
    { mois: 'Sept', CA: 3200 },
    { mois: 'Oct', CA: CAMoisPrecedent || 3240 },
    { mois: 'Nov', CA: chiffreAffaires },
  ];

  // Générer rapport IA
  const genererRapportIA = (): string => {
    const signe = evolutionCA >= 0 ? 'augmenté' : 'diminué';
    const valeur = Math.abs(evolutionCA);
    const nomMoisPrec = new Date(anneeActuel, moisActuel - 1, 1).toLocaleDateString('fr-FR', { month: 'long' });
    
    return `Ce mois-ci, vos revenus ont ${signe} de ${valeur}% par rapport à ${nomMoisPrec}. ${montantEnAttente > 0 ? `${montantEnAttente}€ sont encore en attente de paiement.` : 'Tous les paiements ont été reçus.'}`;
  };

  const handleRelancerPaiements = () => {
    const facturesEnAttente = factures.filter(f => f.statut === 'En attente');
    if (facturesEnAttente.length === 0) {
      toast({
        title: 'Aucun paiement à relancer',
        description: 'Tous les paiements ont été reçus.',
      });
      return;
    }

    toast({
      title: `${facturesEnAttente.length} relance(s) envoyée(s)`,
      description: `Les clients avec des factures en attente ont été relancés automatiquement.`,
    });
  };

  const handleExportPDF = () => {
    toast({
      title: 'Export PDF en cours',
      description: 'Le rapport comptable PDF est en cours de génération...',
    });
    
    // Simulation d'export
    setTimeout(() => {
      toast({
        title: 'PDF exporté',
        description: 'Le rapport comptable PDF a été généré avec succès.',
      });
    }, 1500);
  };

  const getStatutBadge = (statut: Facture['statut']) => {
    switch (statut) {
      case 'Payée':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✅ Payée</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⏳ En attente</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finances & Paiements</h1>
          <p className="mt-2 text-muted-foreground">
            Visualisez vos revenus, les paiements reçus et les relances financières
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRelancerPaiements}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Relancer les paiements en attente
          </Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exporter rapport comptable PDF
          </Button>
        </div>
      </div>

      {/* Résumé mensuel */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{chiffreAffaires.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
              </div>
            </div>
            {evolutionCA !== 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                <TrendingUp className={`h-3 w-3 ${evolutionCA >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                <span className={evolutionCA >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {evolutionCA >= 0 ? '+' : ''}{evolutionCA}% vs mois précédent
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{montantEnAttente.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-muted-foreground">Montant en attente</p>
              </div>
            </div>
            {montantEnAttente > 0 && (
              <p className="mt-2 text-xs text-orange-400">
                {factures.filter(f => f.statut === 'En attente').length} facture(s) en attente
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{tauxConversion}%</div>
                <p className="text-xs text-muted-foreground">Taux de conversion devis / factures</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {nombreFactures} factures / {nombreDevis} devis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rapport IA */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-400 mb-2">Rapport IA</h3>
              <p className="text-sm text-muted-foreground">
                {genererRapportIA()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphique d'évolution du CA */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution du chiffre d'affaires</CardTitle>
          <CardDescription>
            Évolution mensuelle de vos revenus sur les 6 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionCAData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} €`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="CA" 
                stroke="#fbbf24" 
                strokeWidth={2}
                name="Chiffre d'affaires (€)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Liste des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des factures ({factures.length})</CardTitle>
          <CardDescription>
            Toutes vos factures avec leur statut de paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date émission</TableHead>
                  <TableHead>Date paiement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factures.map((facture) => (
                  <TableRow key={facture.id}>
                    <TableCell className="font-medium">{facture.id}</TableCell>
                    <TableCell>{facture.client}</TableCell>
                    <TableCell className="font-semibold">{facture.montant.toLocaleString('fr-FR')} €</TableCell>
                    <TableCell>{getStatutBadge(facture.statut)}</TableCell>
                    <TableCell>{new Date(facture.dateEmission).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      {facture.datePaiement 
                        ? new Date(facture.datePaiement).toLocaleDateString('fr-FR')
                        : <span className="text-muted-foreground">-</span>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {factures.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune facture
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerte paiements en attente */}
      {montantEnAttente > 0 && (
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-400 mb-1">Paiements en attente</h3>
                <p className="text-sm text-muted-foreground">
                  Vous avez {montantEnAttente.toLocaleString('fr-FR')}€ en attente de paiement. 
                  Utilisez le bouton "Relancer les paiements en attente" pour envoyer des rappels automatiques aux clients.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

