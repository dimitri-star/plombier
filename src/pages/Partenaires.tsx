import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  nom: string;
  prenom?: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  dateCreation: string;
  notes?: string;
}

interface Intervention {
  id: string;
  date: string;
  type: string;
  statut: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
  montant?: number;
}

interface Devis {
  id: string;
  date: string;
  travail: string;
  montant: number;
  statut: 'En attente' | 'Signé' | 'Refusé';
}

interface Facture {
  id: string;
  date: string;
  montant: number;
  statut: 'En attente' | 'Payée' | 'En retard';
}

export default function Partenaires() {
  const { toast } = useToast();

  // Données factices de clients
  const [clients, setClients] = useState<Client[]>([
    {
      id: 'C-001',
      nom: 'Colin',
      prenom: 'Marie',
      adresse: '15 Rue de la Paix',
      ville: 'Lyon',
      codePostal: '69001',
      telephone: '06 12 34 56 78',
      email: 'marie.colin@email.com',
      dateCreation: '2024-01-15',
      notes: 'Client fidèle, préfère les interventions le matin.',
    },
    {
      id: 'C-002',
      nom: 'Leroy',
      prenom: 'Jean',
      adresse: '42 Avenue des Champs',
      ville: 'Lyon',
      codePostal: '69002',
      telephone: '06 98 76 54 32',
      email: 'jean.leroy@email.com',
      dateCreation: '2024-02-20',
      notes: 'Très satisfait des dernières interventions.',
    },
    {
      id: 'C-003',
      nom: 'Giraud',
      prenom: 'Sophie',
      adresse: '8 Place Bellecour',
      ville: 'Lyon',
      codePostal: '69002',
      telephone: '06 11 22 33 44',
      email: 'sophie.giraud@email.com',
      dateCreation: '2024-03-10',
      notes: 'Client régulier, interventions d\'entretien.',
    },
    {
      id: 'C-004',
      nom: 'Dubois',
      prenom: 'Pierre',
      adresse: '23 Rue Victor Hugo',
      ville: 'Villeurbanne',
      codePostal: '69100',
      telephone: '06 55 66 77 88',
      email: 'pierre.dubois@email.com',
      dateCreation: '2024-04-05',
    },
  ]);

  // Données factices : historique par client
  const getInterventionsForClient = (clientId: string): Intervention[] => {
    const interventionsMap: { [key: string]: Intervention[] } = {
      'C-001': [
        { id: 'I-001', date: '05/11/2024', type: 'Fuite lavabo', statut: 'Terminée', montant: 180 },
        { id: 'I-005', date: '15/09/2024', type: 'Fuite évier', statut: 'Terminée', montant: 150 },
        { id: 'I-008', date: '20/08/2024', type: 'Réparation WC', statut: 'Terminée', montant: 120 },
      ],
      'C-002': [
        { id: 'I-002', date: '05/11/2024', type: 'Pose douche', statut: 'Terminée', montant: 690 },
        { id: 'I-006', date: '10/10/2024', type: 'Ballon ECS', statut: 'Terminée', montant: 850 },
      ],
      'C-003': [
        { id: 'I-003', date: '06/11/2024', type: 'Entretien chauffe-eau', statut: 'Planifiée', montant: 200 },
        { id: 'I-007', date: '01/10/2024', type: 'Révision annuelle', statut: 'Terminée', montant: 180 },
      ],
      'C-004': [
        { id: 'I-004', date: '07/11/2024', type: 'Débouchage canalisation', statut: 'Planifiée', montant: 250 },
      ],
    };
    return interventionsMap[clientId] || [];
  };

  const getDevisForClient = (clientId: string): Devis[] => {
    const devisMap: { [key: string]: Devis[] } = {
      'C-001': [
        { id: 'D-241', date: '02/11/2024', travail: 'Fuite évier', montant: 180, statut: 'En attente' },
        { id: 'D-238', date: '10/09/2024', travail: 'Réparation WC', montant: 120, statut: 'Signé' },
      ],
      'C-002': [
        { id: 'D-242', date: '01/11/2024', travail: 'Ballon ECS', montant: 690, statut: 'Signé' },
        { id: 'D-239', date: '05/10/2024', travail: 'Pose douche', montant: 690, statut: 'Signé' },
      ],
      'C-003': [
        { id: 'D-243', date: '30/10/2024', travail: 'Canalisation', montant: 1150, statut: 'Refusé' },
      ],
      'C-004': [
        { id: 'D-244', date: '03/11/2024', travail: 'Débouchage canalisation', montant: 250, statut: 'En attente' },
      ],
    };
    return devisMap[clientId] || [];
  };

  const getFacturesForClient = (clientId: string): Facture[] => {
    const facturesMap: { [key: string]: Facture[] } = {
      'C-001': [
        { id: 'F-101', date: '06/11/2024', montant: 180, statut: 'Payée' },
        { id: 'F-098', date: '16/09/2024', montant: 150, statut: 'Payée' },
        { id: 'F-095', date: '21/08/2024', montant: 120, statut: 'Payée' },
      ],
      'C-002': [
        { id: 'F-102', date: '06/11/2024', montant: 690, statut: 'Payée' },
        { id: 'F-099', date: '11/10/2024', montant: 850, statut: 'Payée' },
      ],
      'C-003': [
        { id: 'F-100', date: '02/10/2024', montant: 180, statut: 'Payée' },
      ],
      'C-004': [],
    };
    return facturesMap[clientId] || [];
  };

  // Générer résumé IA pour un client
  const genererResumeIA = (client: Client): string => {
    const interventions = getInterventionsForClient(client.id);
    const devis = getDevisForClient(client.id);
    const factures = getFacturesForClient(client.id);
    
    const interventionsTerminees = interventions.filter(i => i.statut === 'Terminée');
    const urgences = interventions.filter(i => i.type.toLowerCase().includes('fuite') || i.type.toLowerCase().includes('urgence'));
    
    const totalInterventions = interventionsTerminees.length;
    const totalUrgences = urgences.length;
    const totalDevis = devis.length;
    const totalFactures = factures.length;
    
    return `Ce client a eu ${totalInterventions} intervention${totalInterventions > 1 ? 's' : ''} cette année, dont ${totalUrgences} urgence${totalUrgences > 1 ? 's' : ''}. ${totalDevis > 0 ? `${totalDevis} devis créé${totalDevis > 1 ? 's' : ''}.` : ''} ${totalFactures > 0 ? `${totalFactures} facture${totalFactures > 1 ? 's' : ''} émise${totalFactures > 1 ? 's' : ''}.` : ''}${client.notes ? ` Notes : ${client.notes}` : ''}`;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.prenom || ''} ${client.nom}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      client.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newClient: Client = {
      id: `C-${String(clients.length + 1).padStart(3, '0')}`,
      nom: formData.get('nom') as string,
      prenom: formData.get('prenom') as string || undefined,
      adresse: formData.get('adresse') as string,
      ville: formData.get('ville') as string,
      codePostal: formData.get('codePostal') as string,
      telephone: formData.get('telephone') as string,
      email: formData.get('email') as string,
      dateCreation: new Date().toISOString().split('T')[0],
      notes: formData.get('notes') as string || undefined,
    };

    setClients([newClient, ...clients]);
    
    toast({
      title: 'Client créé',
      description: `Le client ${newClient.prenom || ''} ${newClient.nom} a été ajouté avec succès.`,
    });
    
    setOpenDialog(false);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'Terminée':
      case 'Payée':
      case 'Signé':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✅ {statut}</Badge>;
      case 'En cours':
      case 'En attente':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⏳ {statut}</Badge>;
      case 'Refusé':
      case 'En retard':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">❌ {statut}</Badge>;
      case 'Planifiée':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">📅 {statut}</Badge>;
      case 'Annulée':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">❌ {statut}</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients & Historique</h1>
          <p className="mt-2 text-muted-foreground">
            Fiche complète de chaque client et historique des travaux effectués
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Plus className="mr-2 h-4 w-4" />
              Créer nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau client</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau client à votre base de données
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input id="nom" name="nom" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" name="prenom" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse *</Label>
                <Input id="adresse" name="adresse" required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code postal *</Label>
                  <Input id="codePostal" name="codePostal" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville *</Label>
                  <Input id="ville" name="ville" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input id="telephone" name="telephone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes du plombier</Label>
                <Textarea id="notes" name="notes" rows={3} placeholder="Notes internes sur le client..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                  Créer le client
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Recherche rapide par nom ou ville..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des clients */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients ({filteredClients.length})</CardTitle>
          <CardDescription>
            Tous vos clients avec leurs coordonnées complètes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.prenom ? `${client.prenom} ${client.nom}` : client.nom}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {client.adresse}, {client.codePostal} {client.ville}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {client.telephone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedClient(client)}
                      >
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun client trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal détails client */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedClient.prenom ? `${selectedClient.prenom} ${selectedClient.nom}` : selectedClient.nom}
              </DialogTitle>
              <DialogDescription>
                Fiche complète du client avec historique des travaux
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="coordonnees" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="coordonnees">Coordonnées</TabsTrigger>
                <TabsTrigger value="interventions">Interventions</TabsTrigger>
                <TabsTrigger value="devis-factures">Devis / Factures</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              {/* Onglet Coordonnées */}
              <TabsContent value="coordonnees" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Nom complet</Label>
                    <p className="font-medium">{selectedClient.prenom ? `${selectedClient.prenom} ${selectedClient.nom}` : selectedClient.nom}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Date de création</Label>
                    <p className="font-medium">{new Date(selectedClient.dateCreation).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adresse
                    </Label>
                    <p className="font-medium">{selectedClient.adresse}</p>
                    <p className="text-sm text-muted-foreground">{selectedClient.codePostal} {selectedClient.ville}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </Label>
                    <p className="font-medium">{selectedClient.telephone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <p className="font-medium">{selectedClient.email}</p>
                  </div>
                </div>

                {/* Résumé IA */}
                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-400 mb-2">Résumé IA</h3>
                        <p className="text-sm text-muted-foreground">
                          {genererResumeIA(selectedClient)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Interventions */}
              <TabsContent value="interventions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des interventions</CardTitle>
                    <CardDescription>
                      Toutes les interventions effectuées pour ce client
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {getInterventionsForClient(selectedClient.id).length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type d'intervention</TableHead>
                              <TableHead>Statut</TableHead>
                              <TableHead className="text-right">Montant</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getInterventionsForClient(selectedClient.id).map((intervention) => (
                              <TableRow key={intervention.id}>
                                <TableCell>{intervention.date}</TableCell>
                                <TableCell className="font-medium">{intervention.type}</TableCell>
                                <TableCell>{getStatutBadge(intervention.statut)}</TableCell>
                                <TableCell className="text-right font-semibold">
                                  {intervention.montant ? `${intervention.montant.toLocaleString('fr-FR')} €` : '-'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune intervention pour ce client
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Devis / Factures */}
              <TabsContent value="devis-factures" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Devis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Devis liés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getDevisForClient(selectedClient.id).length > 0 ? (
                        <div className="space-y-3">
                          {getDevisForClient(selectedClient.id).map((devis) => (
                            <div key={devis.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">{devis.id}</span>
                                {getStatutBadge(devis.statut)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{devis.travail}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{devis.date}</span>
                                <span className="font-semibold">{devis.montant.toLocaleString('fr-FR')} €</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          Aucun devis pour ce client
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Factures */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Factures liées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getFacturesForClient(selectedClient.id).length > 0 ? (
                        <div className="space-y-3">
                          {getFacturesForClient(selectedClient.id).map((facture) => (
                            <div key={facture.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">{facture.id}</span>
                                {getStatutBadge(facture.statut)}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{facture.date}</span>
                                <span className="font-semibold">{facture.montant.toLocaleString('fr-FR')} €</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          Aucune facture pour ce client
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Onglet Notes */}
              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notes du plombier</CardTitle>
                    <CardDescription>
                      Notes internes sur ce client
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedClient.notes ? (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{selectedClient.notes}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune note pour ce client
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
