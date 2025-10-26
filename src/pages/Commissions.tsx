import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Download, TrendingUp, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Commissions() {
  const { toast } = useToast();

  // Données factices
  const [commissions, setCommissions] = useState([
    {
      id: 1,
      dossier: 'Prêt immobilier - Marie Dubois',
      montant: 4500,
      statut: 'encaissé',
      date: '2024-01-15',
      partenaire: 'Crédit Agricole',
    },
    {
      id: 2,
      dossier: 'Rachat de crédit - Jean Martin',
      montant: 3200,
      statut: 'a_venir',
      date: '2024-02-10',
      partenaire: 'BNP Paribas',
    },
    {
      id: 3,
      dossier: 'Prêt auto - Sophie Bernard',
      montant: 850,
      statut: 'encaissé',
      date: '2024-01-08',
      partenaire: 'Société Générale',
    },
    {
      id: 4,
      dossier: 'Prêt personnel - Pierre Durand',
      montant: 1500,
      statut: 'a_venir',
      date: '2024-03-05',
      partenaire: 'Crédit Mutuel',
    },
    {
      id: 5,
      dossier: 'Prêt immobilier - Anne Martin',
      montant: 5200,
      statut: 'encaissé',
      date: '2024-01-20',
      partenaire: 'Crédit Agricole',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterPartenaire, setFilterPartenaire] = useState('Tous');
  const [openDialog, setOpenDialog] = useState(false);

  const filteredCommissions = commissions.filter((commission) => {
    const matchesSearch = commission.dossier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'Tous' || commission.statut === filterStatut;
    const matchesPartenaire = filterPartenaire === 'Tous' || commission.partenaire === filterPartenaire;
    return matchesSearch && matchesStatut && matchesPartenaire;
  });

  const totalCommissions = commissions.reduce((acc, c) => acc + c.montant, 0);
  const encaisses = commissions.filter(c => c.statut === 'encaissé').reduce((acc, c) => acc + c.montant, 0);
  const aVenir = commissions.filter(c => c.statut === 'a_venir').reduce((acc, c) => acc + c.montant, 0);

  // Données pour le graphique
  const monthlyData = [
    { mois: 'Oct 2023', montant: 8500 },
    { mois: 'Nov 2023', montant: 10200 },
    { mois: 'Déc 2023', montant: 12350 },
    { mois: 'Jan 2024', montant: 15250 },
    { mois: 'Fév 2024', montant: 3200 },
  ];

  const handleAddCommission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Succès',
      description: 'Commission ajoutée avec succès',
    });
    setOpenDialog(false);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: 'Export réussi',
      description: `Export ${format.toUpperCase()} en cours...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commissions</h1>
          <p className="mt-2 text-muted-foreground">
            Suivez vos revenus et prévisions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une commission
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle commission</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCommission} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dossier">Dossier</Label>
                  <Select name="dossier" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un dossier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Prêt immobilier - Marie Dubois</SelectItem>
                      <SelectItem value="2">Rachat de crédit - Jean Martin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montant">Montant (€)</Label>
                  <Input id="montant" name="montant" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select name="statut" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="encaissé">Encaissé</SelectItem>
                      <SelectItem value="a_venir">À venir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Ajouter</Button>
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{totalCommissions.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-muted-foreground">Total commissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{encaisses.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-muted-foreground">Encaissées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{aVenir.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-muted-foreground">À venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="montant" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="encaissé">Encaissé</SelectItem>
                <SelectItem value="a_venir">À venir</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPartenaire} onValueChange={setFilterPartenaire}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Partenaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les partenaires</SelectItem>
                <SelectItem value="Crédit Agricole">Crédit Agricole</SelectItem>
                <SelectItem value="BNP Paribas">BNP Paribas</SelectItem>
                <SelectItem value="Société Générale">Société Générale</SelectItem>
                <SelectItem value="Crédit Mutuel">Crédit Mutuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des commissions ({filteredCommissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dossier</TableHead>
                <TableHead>Partenaire</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">{commission.dossier}</TableCell>
                  <TableCell>{commission.partenaire}</TableCell>
                  <TableCell className="font-semibold">{commission.montant.toLocaleString('fr-FR')} €</TableCell>
                  <TableCell>
                    <Badge variant={commission.statut === 'encaissé' ? 'default' : 'secondary'}>
                      {commission.statut === 'encaissé' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Encaissé
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          À venir
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(commission.date).toLocaleDateString('fr-FR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCommissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune commission trouvée
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
