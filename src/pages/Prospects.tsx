import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Mail, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StatutDevis = 'En attente' | 'Signé' | 'Refusé';

interface Devis {
  id: string;
  client: string;
  travail: string;
  description?: string;
  materiaux?: string;
  dureeEstimee?: string;
  montant: number;
  statut: StatutDevis;
  derniereRelance: string;
  dateCreation: string;
}

interface RelanceAutomatique {
  id: string;
  client: string;
  devisId: string;
  message: string;
  date: string;
  statut: 'envoyé' | 'programmé';
}

export default function Prospects() {
  const { toast } = useToast();

  // Données factices de devis
  const [devis, setDevis] = useState<Devis[]>([
    {
      id: 'D-241',
      client: 'Mme Colin',
      travail: 'Fuite évier',
      description: 'Réparation fuite évier cuisine',
      materiaux: 'Joint silicone, collier serrage',
      dureeEstimee: '1h',
      montant: 180,
      statut: 'En attente',
      derniereRelance: '03/11',
      dateCreation: '02/11',
    },
    {
      id: 'D-242',
      client: 'M. Leroy',
      travail: 'Ballon ECS',
      description: 'Remplacement ballon eau chaude sanitaire',
      materiaux: 'Ballon 200L, raccords, téflon',
      dureeEstimee: '3h',
      montant: 690,
      statut: 'Signé',
      derniereRelance: '02/11',
      dateCreation: '01/11',
    },
    {
      id: 'D-243',
      client: 'ImmoLyon',
      travail: 'Canalisation',
      description: 'Débouchage canalisation principale',
      materiaux: 'Furet, produits déboucheur',
      dureeEstimee: '2h',
      montant: 1150,
      statut: 'Refusé',
      derniereRelance: '01/11',
      dateCreation: '30/10',
    },
  ]);

  // Historique des relances automatiques
  const [relances, setRelances] = useState<RelanceAutomatique[]>([
    {
      id: 'R-001',
      client: 'Mme Colin',
      devisId: 'D-241',
      message: 'Bonjour Mme Colin, avez-vous eu le temps de consulter mon devis ? Je peux intervenir dès demain matin.',
      date: '04/11',
      statut: 'envoyé',
    },
    {
      id: 'R-002',
      client: 'ImmoLyon',
      devisId: 'D-243',
      message: 'Bonjour, avez-vous eu le temps de consulter mon devis ? Je peux intervenir dès demain matin.',
      date: '02/11',
      statut: 'envoyé',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<StatutDevis | 'Tous'>('Tous');
  const [filterType, setFilterType] = useState<'client' | 'montant' | 'date'>('client');
  const [openDialog, setOpenDialog] = useState(false);
  const [openRelancesDialog, setOpenRelancesDialog] = useState(false);

  // Filtrage des devis
  const filteredDevis = devis.filter((devi) => {
    const matchesSearch = 
      (filterType === 'client' && (devi.client.toLowerCase().includes(searchTerm.toLowerCase()) || devi.travail.toLowerCase().includes(searchTerm.toLowerCase()) || devi.id.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (filterType === 'montant' && devi.montant.toString().includes(searchTerm)) ||
      (filterType === 'date' && devi.dateCreation.includes(searchTerm));
    
    const matchesStatut = filterStatut === 'Tous' || devi.statut === filterStatut;

    return matchesSearch && matchesStatut;
  });

  // Devis sans réponse (en attente)
  const devisSansReponse = devis.filter(d => d.statut === 'En attente');

  const handleCreateDevisIA = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Simulation de la génération IA
    toast({
      title: 'Génération en cours...',
      description: 'L\'IA est en train de créer votre devis',
    });

    // Simuler un délai
    setTimeout(() => {
      const client = formData.get('client') as string;
      const travail = formData.get('travail') as string;
      const description = formData.get('description') as string;
      const materiaux = formData.get('materiaux') as string;
      const dureeEstimee = formData.get('dureeEstimee') as string;
      
      // L'IA calcule automatiquement le montant (simulation)
      const duree = parseFloat(dureeEstimee || '1');
      const nbMateriaux = materiaux ? materiaux.split(',').length : 0;
      const montantEstime = Math.round(
        duree * 50 + // 50€ par heure
        nbMateriaux * 30 + // 30€ par matériau
        (description ? description.length / 10 : 0) // Bonus selon complexité
      );

      const newDevis: Devis = {
        id: `D-${241 + devis.length}`,
        client,
        travail,
        description,
        materiaux,
        dureeEstimee: dureeEstimee ? `${dureeEstimee}h` : undefined,
        montant: montantEstime,
        statut: 'En attente',
        derniereRelance: '',
        dateCreation: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      };

      setDevis([newDevis, ...devis]);
      toast({
        title: 'Devis créé avec succès !',
        description: `Le devis a été généré (${montantEstime}€), mis en PDF et envoyé automatiquement.`,
      });
      setOpenDialog(false);
    }, 1500);
  };

  const handleRelanceTous = () => {
    if (devisSansReponse.length === 0) {
      toast({
        title: 'Aucun devis à relancer',
        description: 'Tous les devis ont reçu une réponse.',
      });
      return;
    }

    const nouvellesRelances: RelanceAutomatique[] = devisSansReponse.map((devi, index) => ({
      id: `R-${String(relances.length + index + 1).padStart(3, '0')}`,
      client: devi.client,
      devisId: devi.id,
      message: `Bonjour ${devi.client.split(' ')[1] || devi.client}, avez-vous eu le temps de consulter mon devis ? Je peux intervenir dès demain matin.`,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      statut: 'envoyé' as const,
    }));

    setRelances([...nouvellesRelances, ...relances]);
    
    // Mettre à jour les dates de dernière relance
    setDevis(devis.map(d => 
      d.statut === 'En attente' 
        ? { ...d, derniereRelance: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }
        : d
    ));

    toast({
      title: `${devisSansReponse.length} relance(s) envoyée(s) !`,
      description: 'Les clients sans réponse ont reçu un message automatique.',
    });
  };

  const handleRelanceAutomatique = (devisId: string) => {
    const devi = devis.find(d => d.id === devisId);
    if (devi) {
      const nouvelleRelance: RelanceAutomatique = {
        id: `R-${String(relances.length + 1).padStart(3, '0')}`,
        client: devi.client,
        devisId: devisId,
        message: `Bonjour ${devi.client.split(' ')[1] || devi.client}, avez-vous eu le temps de consulter mon devis ? Je peux intervenir dès demain matin.`,
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        statut: 'envoyé',
      };

      setRelances([nouvelleRelance, ...relances]);
      
      setDevis(devis.map(d => 
        d.id === devisId 
          ? { ...d, derniereRelance: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }
          : d
      ));
      
      toast({
        title: 'Relance envoyée !',
        description: `Un message professionnel a été envoyé à ${devi.client} par l'IA.`,
      });
    }
  };

  const getStatutBadge = (statut: StatutDevis) => {
    switch (statut) {
      case 'Signé':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✅ Accepté</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⏳ En attente</Badge>;
      case 'Refusé':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">❌ Refusé</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Devis & Relances Automatiques</h1>
          <p className="mt-2 text-muted-foreground">
            Générez et relancez vos devis automatiquement grâce à l'IA — Gagnez jusqu'à 2h par jour
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRelanceTous}
            disabled={devisSansReponse.length === 0}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Relancer les clients sans réponse ({devisSansReponse.length})
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Sparkles className="mr-2 h-4 w-4" />
                Créer un devis IA
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un devis avec l'IA</DialogTitle>
                <DialogDescription>
                  L'IA va générer automatiquement le texte, calculer le montant, créer le PDF et l'envoyer au client
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDevisIA} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Input id="client" name="client" placeholder="Mme/M. Nom" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travail">Type de travail *</Label>
                  <Input id="travail" name="travail" placeholder="Ex: Fuite évier, Ballon ECS..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description du travail *</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Décrivez le travail à effectuer..." 
                    rows={3}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materiaux">Matériaux nécessaires</Label>
                  <Input 
                    id="materiaux" 
                    name="materiaux" 
                    placeholder="Ex: Joint silicone, collier serrage, ballon 200L..." 
                  />
                  <p className="text-xs text-muted-foreground">
                    L'IA calculera automatiquement le coût des matériaux
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dureeEstimee">Durée estimée (heures) *</Label>
                  <Input 
                    id="dureeEstimee" 
                    name="dureeEstimee" 
                    type="number" 
                    placeholder="2" 
                    min="0.5"
                    step="0.5"
                    required 
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer avec l'IA
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Rechercher par ${filterType === 'client' ? 'client' : filterType === 'montant' ? 'montant' : 'date'}...`}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'client' | 'montant' | 'date')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Par client</SelectItem>
                <SelectItem value="montant">Par montant</SelectItem>
                <SelectItem value="date">Par date</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatut} onValueChange={(value) => setFilterStatut(value as StatutDevis | 'Tous')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="En attente">⏳ En attente</SelectItem>
                <SelectItem value="Signé">✅ Accepté</SelectItem>
                <SelectItem value="Refusé">❌ Refusés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des devis */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des devis ({filteredDevis.length})</CardTitle>
          <CardDescription>
            Tous vos devis récents avec leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Travail</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière relance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevis.map((devi) => (
                  <TableRow key={devi.id}>
                    <TableCell className="font-medium">{devi.id}</TableCell>
                    <TableCell>{devi.client}</TableCell>
                    <TableCell>{devi.travail}</TableCell>
                    <TableCell className="font-semibold">{devi.montant.toLocaleString('fr-FR')} €</TableCell>
                    <TableCell>{getStatutBadge(devi.statut)}</TableCell>
                    <TableCell>{devi.derniereRelance || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {devi.statut === 'En attente' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRelanceAutomatique(devi.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Relancer
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredDevis.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun devis trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historique des relances automatiques */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des relances automatiques</CardTitle>
              <CardDescription>
                Tous les messages automatiques envoyés par l'IA
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setOpenRelancesDialog(true)}
            >
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {relances.slice(0, 5).map((relance) => (
              <div key={relance.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{relance.client}</span>
                    <Badge variant="outline" className="text-xs">{relance.devisId}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{relance.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{relance.date}</p>
                </div>
                <Badge className={relance.statut === 'envoyé' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {relance.statut === 'envoyé' ? 'Envoyé' : 'Programmé'}
                </Badge>
              </div>
            ))}
            {relances.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune relance automatique pour le moment
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog historique complet */}
      <Dialog open={openRelancesDialog} onOpenChange={setOpenRelancesDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historique complet des relances</DialogTitle>
            <DialogDescription>
              {relances.length} relance(s) automatique(s) enregistrée(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {relances.map((relance) => (
              <div key={relance.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{relance.client}</span>
                    <Badge variant="outline" className="text-xs">{relance.devisId}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{relance.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{relance.date}</p>
                </div>
                <Badge className={relance.statut === 'envoyé' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {relance.statut === 'envoyé' ? 'Envoyé' : 'Programmé'}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
