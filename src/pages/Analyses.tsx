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
import { Plus, Search, Download, MapPin, Calendar, User, Sparkles, Clock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  url: string;
  type: 'avant' | 'apres';
  nom: string;
}

interface Chantier {
  id: string;
  client: string;
  adresse: string;
  date: string;
  type: string;
  statut: 'En cours' | 'Terminé';
  photos: Photo[];
  note?: string;
  resumeIA?: string;
  dureeIntervention?: string;
}

export default function Analyses() {
  const { toast } = useToast();

  // Données factices de chantiers
  const [chantiers, setChantiers] = useState<Chantier[]>([
    {
      id: 'CH-001',
      client: 'Mme Colin',
      adresse: '15 Rue de la Paix, Lyon',
      date: '05/11/2024',
      type: 'Fuite lavabo',
      statut: 'Terminé',
      photos: [
        { id: 'P-001', url: '/placeholder.svg', type: 'avant', nom: 'avant-1.jpg' },
        { id: 'P-002', url: '/placeholder.svg', type: 'apres', nom: 'apres-1.jpg' },
      ],
      note: 'Fuite importante sous évier',
      resumeIA: 'Fuite réparée sous évier, joint changé, temps d\'intervention : 45 min.',
      dureeIntervention: '45 min',
    },
    {
      id: 'CH-002',
      client: 'M. Leroy',
      adresse: '42 Avenue des Champs, Lyon',
      date: '05/11/2024',
      type: 'Pose douche',
      statut: 'Terminé',
      photos: [
        { id: 'P-003', url: '/placeholder.svg', type: 'avant', nom: 'avant-2.jpg' },
        { id: 'P-004', url: '/placeholder.svg', type: 'apres', nom: 'apres-2.jpg' },
      ],
      resumeIA: 'Pose douche complète, carrelage refait, temps d\'intervention : 3h.',
      dureeIntervention: '3h',
    },
    {
      id: 'CH-003',
      client: 'M. Giraud',
      adresse: '8 Place Bellecour, Lyon',
      date: '06/11/2024',
      type: 'Entretien chauffe-eau',
      statut: 'En cours',
      photos: [],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<'Tous' | 'En cours' | 'Terminé'>('Tous');
  const [triPar, setTriPar] = useState<'date' | 'type' | 'client'>('date');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChantier, setSelectedChantier] = useState<Chantier | null>(null);
  const [photosAvant, setPhotosAvant] = useState<File[]>([]);
  const [photosApres, setPhotosApres] = useState<File[]>([]);

  // Filtrer et trier les chantiers
  const filteredAndSortedChantiers = chantiers
    .filter((chantier) => {
      const matchesSearch =
        chantier.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chantier.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chantier.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatut = filterStatut === 'Tous' || chantier.statut === filterStatut;
      return matchesSearch && matchesStatut;
    })
    .sort((a, b) => {
      switch (triPar) {
        case 'date':
          return new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'client':
          return a.client.localeCompare(b.client);
        default:
          return 0;
      }
    });

  const handleAddChantier = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Générer résumé IA automatique
    const type = formData.get('type') as string;
    const note = formData.get('note') as string;
    const duree = formData.get('dureeIntervention') as string;
    
    // Simuler génération IA
    const resumeIA = `${type}${note ? `, ${note}` : ''}${duree ? `, temps d'intervention : ${duree}` : ''}.`;

    // Créer les photos à partir des fichiers uploadés
    const photos: Photo[] = [
      ...photosAvant.map((file, index) => ({
        id: `P-${Date.now()}-avant-${index}`,
        url: URL.createObjectURL(file),
        type: 'avant' as const,
        nom: file.name,
      })),
      ...photosApres.map((file, index) => ({
        id: `P-${Date.now()}-apres-${index}`,
        url: URL.createObjectURL(file),
        type: 'apres' as const,
        nom: file.name,
      })),
    ];

    const newChantier: Chantier = {
      id: `CH-${String(chantiers.length + 1).padStart(3, '0')}`,
      client: formData.get('client') as string,
      adresse: formData.get('adresse') as string,
      date: formData.get('date') as string || new Date().toLocaleDateString('fr-FR'),
      type: type,
      statut: 'Terminé',
      photos,
      note: note || undefined,
      resumeIA,
      dureeIntervention: duree || undefined,
    };

    setChantiers([newChantier, ...chantiers]);

    toast({
      title: 'Chantier ajouté',
      description: `Le chantier a été ajouté avec succès. Résumé IA généré automatiquement.`,
    });

    setOpenDialog(false);
    setPhotosAvant([]);
    setPhotosApres([]);
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avant' | 'apres'
  ) => {
    const files = Array.from(e.target.files || []);
    if (type === 'avant') {
      setPhotosAvant([...photosAvant, ...files]);
    } else {
      setPhotosApres([...photosApres, ...files]);
    }
    toast({
      title: 'Photos ajoutées',
      description: `${files.length} photo(s) ${type === 'avant' ? 'avant' : 'après'} ajoutée(s).`,
    });
  };

  const removePhoto = (index: number, type: 'avant' | 'apres') => {
    if (type === 'avant') {
      setPhotosAvant(photosAvant.filter((_, i) => i !== index));
    } else {
      setPhotosApres(photosApres.filter((_, i) => i !== index));
    }
  };

  const handleExportPDF = (chantierId: string) => {
    const chantier = chantiers.find(c => c.id === chantierId);
    if (chantier) {
      toast({
        title: 'Export PDF en cours',
        description: `Rapport PDF du chantier ${chantierId} en cours de génération...`,
      });
      // Simulation d'export PDF
      setTimeout(() => {
        toast({
          title: 'PDF exporté',
          description: `Le rapport PDF du chantier ${chantierId} a été généré avec succès.`,
        });
      }, 1000);
    }
  };

  const genererResumeIA = (chantier: Chantier): string => {
    if (chantier.resumeIA) {
      return chantier.resumeIA;
    }
    // Génération automatique si pas de résumé
    return `${chantier.type}${chantier.dureeIntervention ? `, temps d'intervention : ${chantier.dureeIntervention}` : ''}.`;
  };

  const getStatutBadge = (statut: Chantier['statut']) => {
    switch (statut) {
      case 'Terminé':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✅ Terminé</Badge>;
      case 'En cours':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⏳ En cours</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chantiers & Photos</h1>
          <p className="mt-2 text-muted-foreground">
            Suivez vos chantiers en cours et stockez les photos avant/après
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un chantier terminé
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un chantier terminé</DialogTitle>
              <DialogDescription>
                Ajoutez un chantier terminé avec photos avant/après et notes
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddChantier} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Input id="client" name="client" placeholder="Mme/M. Nom" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse *</Label>
                <Input id="adresse" name="adresse" placeholder="Adresse complète" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de chantier *</Label>
                <Input id="type" name="type" placeholder="Ex: Fuite lavabo, Pose douche..." required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dureeIntervention">Durée d'intervention</Label>
                  <Input id="dureeIntervention" name="dureeIntervention" placeholder="Ex: 45 min, 2h..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select name="statut" defaultValue="Terminé">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Upload photos avant */}
              <div className="space-y-2">
                <Label>Photos avant</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, 'avant')}
                    className="cursor-pointer"
                  />
                  {photosAvant.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {photosAvant.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Avant ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index, 'avant')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload photos après */}
              <div className="space-y-2">
                <Label>Photos après</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, 'apres')}
                    className="cursor-pointer"
                  />
                  {photosApres.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {photosApres.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Après ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index, 'apres')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Zone de note rapide */}
              <div className="space-y-2">
                <Label htmlFor="note">Note rapide</Label>
                <Textarea
                  id="note"
                  name="note"
                  rows={3}
                  placeholder="Notes sur le chantier..."
                />
                <p className="text-xs text-muted-foreground">
                  L'IA générera automatiquement un résumé à partir de ces informations
                </p>
              </div>

              {/* Résumé IA (prévisualisation) */}
              {(photosAvant.length > 0 || photosApres.length > 0) && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-blue-400 mb-1">Résumé IA (généré automatiquement)</p>
                      <p className="text-sm text-muted-foreground">
                        Le résumé sera généré lors de l'ajout du chantier
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                  Ajouter le chantier
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres et tri */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un chantier (client, adresse, type)..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatut} onValueChange={(value) => setFilterStatut(value as 'Tous' | 'En cours' | 'Terminé')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="Terminé">✅ Terminé</SelectItem>
                <SelectItem value="En cours">⏳ En cours</SelectItem>
              </SelectContent>
            </Select>
            <Select value={triPar} onValueChange={(value) => setTriPar(value as 'date' | 'type' | 'client')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">📅 Par date</SelectItem>
                <SelectItem value="type">🔧 Par type</SelectItem>
                <SelectItem value="client">👤 Par client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des chantiers */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des chantiers ({filteredAndSortedChantiers.length})</CardTitle>
          <CardDescription>
            Tous vos chantiers avec photos avant/après et résumés IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedChantiers.map((chantier) => (
                  <TableRow key={chantier.id}>
                    <TableCell className="font-medium">{chantier.client}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground max-w-xs truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {chantier.adresse}
                      </div>
                    </TableCell>
                    <TableCell>{chantier.date}</TableCell>
                    <TableCell>{chantier.type}</TableCell>
                    <TableCell>{getStatutBadge(chantier.statut)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {chantier.photos.filter(p => p.type === 'avant').length} avant
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {chantier.photos.filter(p => p.type === 'apres').length} après
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedChantier(chantier)}
                        >
                          Voir détails
                        </Button>
                        {chantier.statut === 'Terminé' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportPDF(chantier.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAndSortedChantiers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun chantier trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog détails chantier */}
      {selectedChantier && (
        <Dialog open={!!selectedChantier} onOpenChange={() => setSelectedChantier(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedChantier.type} - {selectedChantier.client}</DialogTitle>
              <DialogDescription>
                Détails du chantier avec photos et résumé IA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client
                  </Label>
                  <p className="font-medium">{selectedChantier.client}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <p className="font-medium">{selectedChantier.date}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </Label>
                  <p className="font-medium">{selectedChantier.adresse}</p>
                </div>
                {selectedChantier.dureeIntervention && (
                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Durée
                    </Label>
                    <p className="font-medium">{selectedChantier.dureeIntervention}</p>
                  </div>
                )}
              </div>

              {/* Résumé IA */}
              {selectedChantier.resumeIA && (
                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-400 mb-2">Résumé IA automatique</h3>
                        <p className="text-sm text-muted-foreground">
                          {genererResumeIA(selectedChantier)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Photos avant */}
              {selectedChantier.photos.filter(p => p.type === 'avant').length > 0 && (
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Photos avant</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {selectedChantier.photos.filter(p => p.type === 'avant').map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.url}
                          alt={photo.nom}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos après */}
              {selectedChantier.photos.filter(p => p.type === 'apres').length > 0 && (
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Photos après</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {selectedChantier.photos.filter(p => p.type === 'apres').map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.url}
                          alt={photo.nom}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {selectedChantier.note && (
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Note rapide</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedChantier.note}</p>
                  </div>
                </div>
              )}

              {/* Bouton export PDF */}
              {selectedChantier.statut === 'Terminé' && (
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={() => handleExportPDF(selectedChantier.id)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exporter rapport PDF chantier
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
