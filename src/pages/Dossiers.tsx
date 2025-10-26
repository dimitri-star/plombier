import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, FileText, ChevronRight, UserPlus, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusSteps = [
  { id: 'en_attente', label: 'En attente', icon: Clock },
  { id: 'documents_recus', label: 'Documents reçus', icon: FileText },
  { id: 'en_analyse', label: 'En analyse', icon: Eye },
  { id: 'accepte', label: 'Accepté', icon: CheckCircle },
  { id: 'refuse', label: 'Refusé', icon: XCircle },
];

export default function Dossiers() {
  const { profile } = useAuth();
  const { toast } = useToast();

  // Données factices
  const [dossiers, setDossiers] = useState([
    {
      id: 1,
      client_nom: 'Marie Dubois',
      client_email: 'marie.dubois@email.com',
      type: 'Prêt immobilier',
      montant: 320000,
      banque: 'Crédit Agricole',
      statut: 'en_analyse',
      date_creation: '2024-01-10',
      note_interne: 'Client sérieux, dossier bien constitué',
      documents: [
        { nom: 'Pièce d\'identité', statut: 'reçu' },
        { nom: 'Justificatif de domicile', statut: 'reçu' },
        { nom: 'Bulletins de salaire', statut: 'reçu' },
      ],
      historique: [
        { date: '2024-01-15', action: 'Dossier mis en analyse', auteur: profile?.nom || 'Jean Dupont' },
        { date: '2024-01-12', action: 'Tous les documents reçus', auteur: profile?.nom || 'Jean Dupont' },
        { date: '2024-01-10', action: 'Dossier créé', auteur: profile?.nom || 'Jean Dupont' },
      ],
      aUnAccesClient: true,
    },
    {
      id: 2,
      client_nom: 'Jean Martin',
      client_email: 'jean.martin@email.com',
      type: 'Rachat de crédit',
      montant: 150000,
      banque: 'BNP Paribas',
      statut: 'documents_recus',
      date_creation: '2024-01-14',
      note_interne: 'A besoin d\'un rachat pour réduire ses mensualités',
      documents: [
        { nom: 'Pièce d\'identité', statut: 'reçu' },
        { nom: 'Justificatif de domicile', statut: 'reçu' },
        { nom: 'Situation bancaire', statut: 'en_attente' },
      ],
      historique: [
        { date: '2024-01-14', action: 'Dossier créé', auteur: profile?.nom || 'Jean Dupont' },
      ],
      aUnAccesClient: false,
    },
    {
      id: 3,
      client_nom: 'Sophie Bernard',
      client_email: 'sophie.bernard@email.com',
      type: 'Prêt auto',
      montant: 25000,
      banque: 'Société Générale',
      statut: 'accepte',
      date_creation: '2024-01-08',
      note_interne: 'Dossier validé rapidement',
      documents: [
        { nom: 'Pièce d\'identité', statut: 'reçu' },
        { nom: 'Justificatif de domicile', statut: 'reçu' },
        { nom: 'Bulletins de salaire', statut: 'reçu' },
      ],
      historique: [
        { date: '2024-01-11', action: 'Dossier accepté', auteur: profile?.nom || 'Jean Dupont' },
        { date: '2024-01-09', action: 'Analyse complète effectuée', auteur: profile?.nom || 'Jean Dupont' },
        { date: '2024-01-08', action: 'Dossier créé', auteur: profile?.nom || 'Jean Dupont' },
      ],
      aUnAccesClient: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('Tous');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<any>(null);

  const filteredDossiers = dossiers.filter((dossier) => {
    const matchesSearch = 
      dossier.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = selectedStatut === 'Tous' || dossier.statut === selectedStatut;

    return matchesSearch && matchesStatut;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-gray-100 text-gray-800';
      case 'documents_recus': return 'bg-blue-100 text-blue-800';
      case 'en_analyse': return 'bg-yellow-100 text-yellow-800';
      case 'accepte': return 'bg-green-100 text-green-800';
      case 'refuse': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateTempPassword = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `Crt${randomNum}!`;
  };

  const handleCreateAccesClient = (dossierId: number) => {
    const dossier = dossiers.find(d => d.id === dossierId);
    if (!dossier) return;

    // Simule la vérification si l'utilisateur existe déjà (mode test)
    const userExists = false; // En production, vérifier en base
    
    if (userExists) {
      toast({
        title: 'Client existant',
        description: 'Client déjà existant — compte lié au dossier',
      });
    } else {
      // Générer mot de passe temporaire
      const tempPassword = generateTempPassword();
      const credentials = {
        email: dossier.client_email,
        temp_password: tempPassword,
        created_at: new Date().toISOString(),
      };

      // Mettre à jour le dossier avec les credentials
      setDossiers(dossiers.map(d => 
        d.id === dossierId ? { ...d, aUnAccesClient: true, credentials } : d
      ));

      // Afficher la modal avec les identifiants
      setSelectedDossier({
        ...dossier,
        credentials,
        showCredentialsModal: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dossiers clients</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez tous vos dossiers clients
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau dossier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau dossier</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client_nom">Nom du client</Label>
                  <Input id="client_nom" name="client_nom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Email</Label>
                  <Input id="client_email" name="client_email" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de dossier</Label>
                <Select name="type">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prêt immobilier">Prêt immobilier</SelectItem>
                    <SelectItem value="Rachat de crédit">Rachat de crédit</SelectItem>
                    <SelectItem value="Prêt auto">Prêt auto</SelectItem>
                    <SelectItem value="Prêt personnel">Prêt personnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="montant">Montant (€)</Label>
                  <Input id="montant" name="montant" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banque">Banque partenaire</Label>
                  <Input id="banque" name="banque" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note_interne">Note interne</Label>
                <Textarea id="note_interne" name="note_interne" rows={3} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Créer le dossier</Button>
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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un dossier..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedStatut} onValueChange={setSelectedStatut}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                {statusSteps.map((step) => (
                  <SelectItem key={step.id} value={step.id}>
                    {step.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline visuel */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline des dossiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const count = dossiers.filter(d => d.statut === step.id).length;
              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full p-2 ${getStatusColor(step.id)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{step.label}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <ChevronRight className="h-6 w-6 text-muted-foreground mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Liste des dossiers */}
      <div className="space-y-4">
        {filteredDossiers.map((dossier) => (
          <Card key={dossier.id}>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Informations principales */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{dossier.client_nom}</h3>
                    <p className="text-sm text-muted-foreground">{dossier.client_email}</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Type: </span>
                      <span className="font-medium">{dossier.type}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Montant: </span>
                      <span className="font-medium">{dossier.montant.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Banque: </span>
                      <span className="font-medium">{dossier.banque}</span>
                    </div>
                  </div>

                  <div>
                    <Badge className={getStatusColor(dossier.statut)}>
                      {statusSteps.find(s => s.id === dossier.statut)?.label}
                    </Badge>
                  </div>
                </div>

                {/* Documents et actions */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Documents</h4>
                    <div className="space-y-2">
                      {dossier.documents.map((doc: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span>{doc.nom}</span>
                          <Badge variant={doc.statut === 'reçu' ? 'default' : 'outline'}>
                            {doc.statut}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Notes internes</h4>
                    <p className="text-sm text-muted-foreground">{dossier.note_interne}</p>
                  </div>

                  {!dossier.aUnAccesClient && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateAccesClient(dossier.id)}
                      className="w-full"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Créer un accès client
                    </Button>
                  )}

                  {dossier.aUnAccesClient && dossier.credentials && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-900">✅ Compte client créé</p>
                      <p className="text-xs text-green-700 mt-1">Email: {dossier.client_email}</p>
                      <p className="text-xs text-green-700 font-mono">Mot de passe: {dossier.credentials.temp_password}</p>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedDossier({ ...dossier, showCredentialsModal: false })}
                  >
                    Voir l'historique
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog historique ou credentials */}
      {selectedDossier && (
        <Dialog open={!!selectedDossier} onOpenChange={() => setSelectedDossier(null)}>
          <DialogContent>
            {selectedDossier.showCredentialsModal ? (
              <>
                <DialogHeader>
                  <DialogTitle>✅ Compte client créé</DialogTitle>
                  <DialogDescription>
                    Transmettez ces identifiants au client
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-mono text-sm font-semibold">{selectedDossier.credentials.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Mot de passe temporaire</p>
                        <p className="font-mono text-lg font-bold text-green-600">{selectedDossier.credentials.temp_password}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ⚠️ Ces identifiants sont affichés ici uniquement. Le mot de passe sera automatiquement supprimé après 24h.
                    </p>
                  </div>
                  <Button onClick={() => setSelectedDossier(null)} className="w-full">
                    J'ai noté les identifiants
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Historique des mises à jour</DialogTitle>
                  <DialogDescription>
                    Dossier: {selectedDossier.client_nom}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {selectedDossier.historique.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4 border-l-2 pl-4">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.auteur} • {new Date(item.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
