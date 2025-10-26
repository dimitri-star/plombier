import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Mail, Phone, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Prospects() {
  const { toast } = useToast();

  // Données factices de prospects
  const [prospects, setProspects] = useState([
    {
      id: 1,
      nom: 'Marie Dubois',
      telephone: '06 12 34 56 78',
      email: 'marie.dubois@email.com',
      type: 'Immobilier',
      source: 'Site web',
      statut: 'Nouveau',
      date: '2024-01-15',
    },
    {
      id: 2,
      nom: 'Jean Martin',
      telephone: '06 98 76 54 32',
      email: 'jean.martin@email.com',
      type: 'Prêt personnel',
      source: 'Recommandation',
      statut: 'En contact',
      date: '2024-01-14',
    },
    {
      id: 3,
      nom: 'Sophie Bernard',
      telephone: '06 11 22 33 44',
      email: 'sophie.bernard@email.com',
      type: 'Rachat de crédit',
      source: 'Facebook',
      statut: 'Proposition envoyée',
      date: '2024-01-13',
    },
    {
      id: 4,
      nom: 'Marc Laurent',
      telephone: '06 55 66 77 88',
      email: 'marc.laurent@email.com',
      type: 'Immobilier',
      source: 'Google Ads',
      statut: 'Rendez-vous fixé',
      date: '2024-01-12',
    },
    {
      id: 5,
      nom: 'Julie Petit',
      telephone: '06 99 88 77 66',
      email: 'julie.petit@email.com',
      type: 'Prêt auto',
      source: 'Site web',
      statut: 'Nouveau',
      date: '2024-01-11',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterSource, setFilterSource] = useState('Tous');
  const [openDialog, setOpenDialog] = useState(false);

  // Filtrage des prospects
  const filteredProspects = prospects.filter((prospect) => {
    const matchesSearch = 
      prospect.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.telephone.includes(searchTerm);
    
    const matchesStatut = filterStatut === 'Tous' || prospect.statut === filterStatut;
    const matchesSource = filterSource === 'Tous' || prospect.source === filterSource;

    return matchesSearch && matchesStatut && matchesSource;
  });

  const handleAddProspect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProspect = {
      id: prospects.length + 1,
      nom: formData.get('nom') as string,
      telephone: formData.get('telephone') as string,
      email: formData.get('email') as string,
      type: formData.get('type') as string,
      source: formData.get('source') as string,
      statut: 'Nouveau',
      date: new Date().toISOString().split('T')[0],
    };

    setProspects([newProspect, ...prospects]);
    toast({
      title: 'Succès',
      description: 'Prospect ajouté avec succès',
    });
    setOpenDialog(false);
  };

  const convertToDossier = (prospectId: number) => {
    const prospect = prospects.find(p => p.id === prospectId);
    if (prospect) {
      // Mettre à jour le statut
      setProspects(prospects.map(p => 
        p.id === prospectId ? { ...p, statut: 'Converti' } : p
      ));
      toast({
        title: 'Succès',
        description: 'Prospect converti en dossier client',
      });
    }
  };

  const updateStatut = (prospectId: number, nouveauStatut: string) => {
    setProspects(prospects.map(p => 
      p.id === prospectId ? { ...p, statut: nouveauStatut } : p
    ));
    toast({
      title: 'Succès',
      description: 'Statut mis à jour',
    });
  };

  const getStatutBadgeColor = (statut: string) => {
    switch (statut) {
      case 'Nouveau': return 'bg-blue-100 text-blue-800';
      case 'En contact': return 'bg-yellow-100 text-yellow-800';
      case 'Proposition envoyée': return 'bg-purple-100 text-purple-800';
      case 'Rendez-vous fixé': return 'bg-orange-100 text-orange-800';
      case 'Converti': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statuts = ['Tous', 'Nouveau', 'En contact', 'Proposition envoyée', 'Rendez-vous fixé', 'Converti'];
  const sources = ['Tous', 'Site web', 'Google Ads', 'Facebook', 'Recommandation', 'Autre'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Prospects</h1>
          <p className="mt-2 text-muted-foreground">
            Centralisez tous vos leads
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un prospect
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau prospect</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProspect} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom complet</Label>
                <Input id="nom" name="nom" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" name="telephone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Immobilier">Immobilier</SelectItem>
                    <SelectItem value="Prêt personnel">Prêt personnel</SelectItem>
                    <SelectItem value="Rachat de crédit">Rachat de crédit</SelectItem>
                    <SelectItem value="Prêt auto">Prêt auto</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select name="source" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Site web">Site web</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Recommandation">Recommandation</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un prospect..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {statuts.map((statut) => (
                  <SelectItem key={statut} value={statut}>
                    {statut}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des prospects */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des prospects ({filteredProspects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProspects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="font-medium">{prospect.nom}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {prospect.telephone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {prospect.email}
                    </div>
                  </TableCell>
                  <TableCell>{prospect.type}</TableCell>
                  <TableCell>{prospect.source}</TableCell>
                  <TableCell>
                    <Badge className={getStatutBadgeColor(prospect.statut)}>
                      {prospect.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(prospect.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={prospect.statut}
                        onValueChange={(value) => updateStatut(prospect.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuts.slice(1).map((statut) => (
                            <SelectItem key={statut} value={statut}>
                              {statut}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {prospect.statut !== 'Converti' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => convertToDossier(prospect.id)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Convertir
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProspects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun prospect trouvé
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
