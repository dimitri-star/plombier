import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Mail, Phone, Building2, User, FileText, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Partenaires() {
  const { toast } = useToast();

  // Données factices
  const [partenaires, setPartenaires] = useState([
    {
      id: 1,
      nom: 'Crédit Agricole',
      type: 'Banque',
      contact_nom: 'Sophie Martin',
      contact_email: 'sophie.martin@credit-agricole.fr',
      contact_telephone: '01 23 45 67 89',
      dossiers_en_cours: 5,
      taux_acceptation: 85,
      note_interne: 'Excellent partenaire, délais respectés et excellent taux d\'acceptation',
      qualite: 'Excellente',
    },
    {
      id: 2,
      nom: 'BNP Paribas',
      type: 'Banque',
      contact_nom: 'Pierre Dupont',
      contact_email: 'pierre.dupont@bnpparibas.fr',
      contact_telephone: '01 34 56 78 90',
      dossiers_en_cours: 3,
      taux_acceptation: 78,
      note_interne: 'Bon partenaire, quelques retards occasionnels sur les réponses',
      qualite: 'Bonne',
    },
    {
      id: 3,
      nom: 'Crédit Mutuel',
      type: 'Banque',
      contact_nom: 'Marie Laurent',
      contact_email: 'marie.laurent@creditmutuel.fr',
      contact_telephone: '01 45 67 89 01',
      dossiers_en_cours: 7,
      taux_acceptation: 92,
      note_interne: 'Excellent partenaire, très réactif et taux d\'acceptation élevé',
      qualite: 'Excellente',
    },
    {
      id: 4,
      nom: 'Société Générale',
      type: 'Banque',
      contact_nom: 'Jean Bernard',
      contact_email: 'jean.bernard@socgen.fr',
      contact_telephone: '01 56 78 90 12',
      dossiers_en_cours: 2,
      taux_acceptation: 70,
      note_interne: 'Partenaire correct mais délais parfois longs',
      qualite: 'Moyenne',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState<any>(null);

  const filteredPartenaires = partenaires.filter((partenaire) =>
    partenaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.contact_nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQualiteColor = (qualite: string) => {
    switch (qualite) {
      case 'Excellente':
        return 'bg-green-100 text-green-800';
      case 'Bonne':
        return 'bg-blue-100 text-blue-800';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPartenaire = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Succès',
      description: 'Partenaire ajouté avec succès',
    });
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partenaires</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez vos relations professionnelles
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un partenaire
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau partenaire</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPartenaire} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du partenaire</Label>
                <Input id="nom" name="nom" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de partenaire</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Banque">Banque</SelectItem>
                    <SelectItem value="Assurance">Assurance</SelectItem>
                    <SelectItem value="Notaire">Notaire</SelectItem>
                    <SelectItem value="Expert-comptable">Expert-comptable</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_nom">Contact référent</Label>
                <Input id="contact_nom" name="contact_nom" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input id="contact_email" name="contact_email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_telephone">Téléphone</Label>
                <Input id="contact_telephone" name="contact_telephone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note_interne">Notes internes</Label>
                <Textarea id="note_interne" name="note_interne" rows={3} />
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

      {/* Stats globales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{partenaires.length}</div>
                <p className="text-xs text-muted-foreground">Partenaires actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {partenaires.reduce((acc, p) => acc + p.dossiers_en_cours, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Dossiers en cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(partenaires.reduce((acc, p) => acc + p.taux_acceptation, 0) / partenaires.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Taux d'acceptation moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un partenaire..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau des partenaires */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des partenaires ({filteredPartenaires.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Dossiers</TableHead>
                <TableHead>Taux</TableHead>
                <TableHead>Qualité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartenaires.map((partenaire) => (
                <TableRow key={partenaire.id}>
                  <TableCell className="font-medium">{partenaire.nom}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{partenaire.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {partenaire.contact_nom}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${partenaire.contact_email}`} className="text-sm hover:text-primary">
                        {partenaire.contact_email}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${partenaire.contact_telephone}`} className="text-sm hover:text-primary">
                        {partenaire.contact_telephone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{partenaire.dossiers_en_cours}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{partenaire.taux_acceptation}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getQualiteColor(partenaire.qualite)}>
                      {partenaire.qualite}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPartenaire(partenaire)}
                    >
                      Voir détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPartenaires.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun partenaire trouvé
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal détails partenaire */}
      {selectedPartenaire && (
        <Dialog open={!!selectedPartenaire} onOpenChange={() => setSelectedPartenaire(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPartenaire.nom}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedPartenaire.type}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Dossiers en cours</Label>
                  <p className="font-medium text-lg">{selectedPartenaire.dossiers_en_cours}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Taux d'acceptation</Label>
                  <p className="font-medium text-lg">{selectedPartenaire.taux_acceptation}%</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Qualité</Label>
                  <Badge className={getQualiteColor(selectedPartenaire.qualite)}>
                    {selectedPartenaire.qualite}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Contact référent</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPartenaire.contact_nom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedPartenaire.contact_email}`} className="text-sm hover:text-primary">
                      {selectedPartenaire.contact_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedPartenaire.contact_telephone}`} className="text-sm hover:text-primary">
                      {selectedPartenaire.contact_telephone}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Notes internes</Label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm">{selectedPartenaire.note_interne}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir les dossiers
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
