import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, Search, Download, FileText, Image, File, AlertCircle, CheckCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Documents() {
  const { toast } = useToast();

  // Données factices
  const [documents, setDocuments] = useState([
    {
      id: 1,
      nom: 'Pièce d\'identité - Marie Dubois',
      type: 'Pièce d\'identité',
      dossier: 'Prêt immobilier - Marie Dubois',
      dossier_id: 1,
      date_upload: '2024-01-10',
      statut: 'validé',
      taille: '2.4 MB',
      format: 'PDF',
    },
    {
      id: 2,
      nom: 'Justificatif de domicile - Jean Martin',
      type: 'Justificatif de domicile',
      dossier: 'Rachat de crédit - Jean Martin',
      dossier_id: 2,
      date_upload: '2024-01-14',
      statut: 'en_attente',
      taille: '1.8 MB',
      format: 'PDF',
    },
    {
      id: 3,
      nom: 'Bulletins de salaire - Sophie Bernard',
      type: 'Bulletins de salaire',
      dossier: 'Prêt auto - Sophie Bernard',
      dossier_id: 3,
      date_upload: '2024-01-08',
      statut: 'validé',
      taille: '3.2 MB',
      format: 'PDF',
    },
    {
      id: 4,
      nom: 'Photo CNI - Marie Dubois',
      type: 'Pièce d\'identité',
      dossier: 'Prêt immobilier - Marie Dubois',
      dossier_id: 1,
      date_upload: '2024-01-10',
      statut: 'validé',
      taille: '856 KB',
      format: 'JPG',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [filterStatut, setFilterStatut] = useState('Tous');

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Tous' || doc.type === filterType;
    const matchesStatut = filterStatut === 'Tous' || doc.statut === filterStatut;
    return matchesSearch && matchesType && matchesStatut;
  });

  const typesDocument = ['Tous', 'Pièce d\'identité', 'Justificatif de domicile', 'Bulletins de salaire', 'RIB', 'Avis d\'imposition', 'Autre'];
  const statutsDocument = ['Tous', 'validé', 'en_attente', 'rejeté'];

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'validé':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'rejeté':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'JPG':
      case 'PNG':
        return <Image className="h-5 w-5 text-green-600" />;
      default:
        return <File className="h-5 w-5 text-blue-600" />;
    }
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast({
      title: 'Succès',
      description: 'Document uploadé avec succès',
    });
    setOpenDialog(false);
  };

  const piecesManquantes = [
    { dossier: 'Rachat de crédit - Jean Martin', pieces: ['Situation bancaire', 'Derniers avis d\'imposition'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des documents</h1>
          <p className="mt-2 text-muted-foreground">
            Centralisez et sécurisez tous vos fichiers
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Téléverser un document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Téléverser un document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dossier">Dossier concerné</Label>
                <Select name="dossier" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un dossier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Prêt immobilier - Marie Dubois</SelectItem>
                    <SelectItem value="2">Rachat de crédit - Jean Martin</SelectItem>
                    <SelectItem value="3">Prêt auto - Sophie Bernard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de document</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pièce d'identité">Pièce d'identité</SelectItem>
                    <SelectItem value="Justificatif de domicile">Justificatif de domicile</SelectItem>
                    <SelectItem value="Bulletins de salaire">Bulletins de salaire</SelectItem>
                    <SelectItem value="RIB">RIB</SelectItem>
                    <SelectItem value="Avis d'imposition">Avis d'imposition</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Fichier (PDF, images, justificatifs)</Label>
                <Input id="file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Téléverser
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Indicateur pièces manquantes */}
      {piecesManquantes.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-orange-900">Pièces manquantes</h3>
                <div className="mt-2 space-y-2">
                  {piecesManquantes.map((item, idx) => (
                    <div key={idx} className="text-sm text-orange-800">
                      <span className="font-medium">{item.dossier}:</span>
                      <span className="ml-2">{item.pieces.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typesDocument.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {statutsDocument.map((statut) => (
                  <SelectItem key={statut} value={statut}>
                    {statut === 'Tous' ? 'Tous' : statut}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dossier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.format)}
                      <div>
                        <p className="font-medium">{doc.nom}</p>
                        <p className="text-xs text-muted-foreground">{doc.taille}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.dossier}</TableCell>
                  <TableCell>{new Date(doc.date_upload).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{getStatutBadge(doc.statut)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun document trouvé
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
