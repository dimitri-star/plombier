import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Search, Sparkles, MessageSquare, Bell, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

type StatutIntervention = 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée' | 'À venir';
type VueCalendrier = 'jour' | 'semaine' | 'mois';

interface Intervention {
  id: string;
  date: string;
  dateISO: string; // Format YYYY-MM-DD pour le calendrier
  heure: string;
  client: string;
  intervention: string;
  statut: StatutIntervention;
  telephone?: string;
  adresse?: string;
  dureeEstimee?: string;
  dateCreation?: string;
}

interface RappelInterne {
  id: string;
  interventionId: string;
  message: string;
  date: string;
  heure: string;
  envoye: boolean;
}

export default function Dossiers() {
  const { profile } = useAuth();
  const { toast } = useToast();

  // Données factices d'interventions
  const [interventions, setInterventions] = useState<Intervention[]>([
    {
      id: 'I-001',
      date: '5 nov',
      dateISO: '2024-11-05',
      heure: '9h',
      client: 'Mme Colin',
      intervention: 'Fuite lavabo',
      statut: 'Planifiée',
      telephone: '06 12 34 56 78',
      adresse: '15 Rue de la Paix, Lyon',
      dureeEstimee: '1h30',
      dateCreation: '2024-11-01',
    },
    {
      id: 'I-002',
      date: '5 nov',
      dateISO: '2024-11-05',
      heure: '14h',
      client: 'M. Lefebvre',
      intervention: 'Pose douche',
      statut: 'Terminée',
      telephone: '06 98 76 54 32',
      adresse: '42 Avenue des Champs, Lyon',
      dureeEstimee: '3h',
      dateCreation: '2024-11-02',
    },
    {
      id: 'I-003',
      date: '6 nov',
      dateISO: '2024-11-06',
      heure: '10h',
      client: 'M. Giraud',
      intervention: 'Entretien chauffe-eau',
      statut: 'À venir',
      telephone: '06 11 22 33 44',
      adresse: '8 Place Bellecour, Lyon',
      dureeEstimee: '2h',
      dateCreation: '2024-11-03',
    },
  ]);

  // Rappels internes "départ chantier"
  const [rappelsInternes, setRappelsInternes] = useState<RappelInterne[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<StatutIntervention | 'Tous'>('Tous');
  const [openDialog, setOpenDialog] = useState(false);
  const [iaSuggestion, setIaSuggestion] = useState<{ date: string; heure: string; dateISO: string } | null>(null);
  const [vueCalendrier, setVueCalendrier] = useState<VueCalendrier>('semaine');
  const [dateSelectionnee, setDateSelectionnee] = useState<Date>(new Date());

  // Filtrer les interventions
  const filteredInterventions = interventions.filter((intervention) => {
    const matchesSearch = 
      intervention.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.intervention.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (intervention.adresse && intervention.adresse.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatut = filterStatut === 'Tous' || intervention.statut === filterStatut;

    return matchesSearch && matchesStatut;
  });

  // Interventions pour la vue calendrier
  const interventionsParDate = useMemo(() => {
    const today = new Date();
    const interventionsFiltrees = filteredInterventions;

    switch (vueCalendrier) {
      case 'jour':
        return interventionsFiltrees.filter(i => {
          const dateInter = new Date(i.dateISO);
          return isSameDay(dateInter, dateSelectionnee);
        });
      
      case 'semaine':
        const startWeek = startOfWeek(dateSelectionnee, { locale: fr });
        const endWeek = endOfWeek(dateSelectionnee, { locale: fr });
        return interventionsFiltrees.filter(i => {
          const dateInter = new Date(i.dateISO);
          return dateInter >= startWeek && dateInter <= endWeek;
        });
      
      case 'mois':
        const startMonth = startOfMonth(dateSelectionnee);
        const endMonth = endOfMonth(dateSelectionnee);
        return interventionsFiltrees.filter(i => {
          const dateInter = new Date(i.dateISO);
          return dateInter >= startMonth && dateInter <= endMonth;
        });
      
      default:
        return interventionsFiltrees;
    }
  }, [filteredInterventions, vueCalendrier, dateSelectionnee]);

  // Simuler la suggestion de créneau optimal par l'IA
  const suggestOptimalCreneau = () => {
    // Simulation : l'IA analyse les créneaux existants et propose le meilleur
    const interventionsExistantes = interventions.filter(i => 
      i.statut === 'Planifiée' || i.statut === 'À venir'
    );
    
    // Proposer demain matin 9h si disponible, sinon après-midi 14h
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Vérifier si le créneau 9h est libre
    const creneau9h = interventionsExistantes.find(i => 
      i.dateISO === format(tomorrow, 'yyyy-MM-dd') && i.heure === '9h'
    );
    
    const heureOptimale = creneau9h ? '14h' : '9h';
    const dateStr = tomorrow.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    
    const suggestion = { 
      date: dateStr, 
      heure: heureOptimale,
      dateISO: format(tomorrow, 'yyyy-MM-dd')
    };
    setIaSuggestion(suggestion);
    
    toast({
      title: 'Suggestion IA',
      description: `Créneau optimal proposé : ${suggestion.date} à ${suggestion.heure} (le plus proche et sans conflit)`,
    });
  };

  const handleAddIntervention = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const dateStr = formData.get('date') as string;
    const dateISO = iaSuggestion?.dateISO || new Date().toISOString().split('T')[0];
    
    const newIntervention: Intervention = {
      id: `I-${String(interventions.length + 1).padStart(3, '0')}`,
      date: dateStr,
      dateISO: dateISO,
      heure: formData.get('heure') as string,
      client: formData.get('client') as string,
      intervention: formData.get('intervention') as string,
      statut: 'Planifiée',
      telephone: formData.get('telephone') as string || undefined,
      adresse: formData.get('adresse') as string || undefined,
      dureeEstimee: formData.get('dureeEstimee') as string || undefined,
      dateCreation: new Date().toISOString().split('T')[0],
    };

    setInterventions([newIntervention, ...interventions]);
    
    // Créer un rappel interne "départ chantier" 30 minutes avant
    const heureRappel = parseInt(newIntervention.heure) - 1; // 1h avant pour simplifier
    const rappelInterne: RappelInterne = {
      id: `R-${String(rappelsInternes.length + 1).padStart(3, '0')}`,
      interventionId: newIntervention.id,
      message: `Rappel départ chantier : ${newIntervention.client} - ${newIntervention.intervention} à ${newIntervention.heure}`,
      date: newIntervention.date,
      heure: `${heureRappel}h`,
      envoye: false,
    };
    setRappelsInternes([rappelInterne, ...rappelsInternes]);
    
    // Simuler l'envoi automatique de SMS/email de rappel programmé pour 24h avant
    toast({
      title: 'Intervention créée',
      description: `SMS/email de rappel programmé pour 24h avant. Rappel interne "départ chantier" configuré.`,
    });
    
    setOpenDialog(false);
    setIaSuggestion(null);
  };

  const handleSendRappel = (interventionId: string) => {
    const intervention = interventions.find(i => i.id === interventionId);
    if (intervention) {
      toast({
        title: 'SMS/Email de rappel envoyé',
        description: `Rappel envoyé à ${intervention.client} pour l'intervention du ${intervention.date} à ${intervention.heure}.`,
      });
    }
  };

  const updateStatut = (interventionId: string, nouveauStatut: StatutIntervention) => {
    setInterventions(interventions.map(i => 
      i.id === interventionId ? { ...i, statut: nouveauStatut } : i
    ));
    toast({
      title: 'Statut mis à jour',
      description: `L'intervention est maintenant ${nouveauStatut.toLowerCase()}.`,
    });
  };

  const getStatutBadge = (statut: StatutIntervention) => {
    switch (statut) {
      case 'Planifiée':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">�� Planifiée</Badge>;
      case 'En cours':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">🟠 En cours</Badge>;
      case 'Terminée':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✅ Terminée</Badge>;
      case 'Annulée':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">❌ Annulée</Badge>;
      case 'À venir':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">🟡 À venir</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  // Obtenir les interventions pour une date donnée (pour le calendrier)
  const getInterventionsForDate = (date: Date) => {
    return interventions.filter(i => {
      const dateInter = new Date(i.dateISO);
      return isSameDay(dateInter, date);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Planning & Interventions</h1>
          <p className="mt-2 text-muted-foreground">
            Planifiez vos rendez-vous et suivez vos chantiers — Rappels automatiques SMS/email 24h avant
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter intervention
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle intervention</DialogTitle>
              <DialogDescription>
                L'IA peut vous proposer un créneau optimal pour cette intervention
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddIntervention} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Input id="client" name="client" placeholder="Mme/M. Nom" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intervention">Type de travail *</Label>
                <Input id="intervention" name="intervention" placeholder="Ex: Fuite lavabo, Pose douche..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse *</Label>
                <Input id="adresse" name="adresse" placeholder="Ex: 15 Rue de la Paix, Lyon" required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dureeEstimee">Durée estimée *</Label>
                  <Input 
                    id="dureeEstimee" 
                    name="dureeEstimee" 
                    placeholder="Ex: 2h, 1h30..."
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone (pour SMS de rappel)</Label>
                  <Input id="telephone" name="telephone" placeholder="06 12 34 56 78" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    placeholder="5 nov"
                    defaultValue={iaSuggestion?.date || ''}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure">Heure *</Label>
                  <Input 
                    id="heure" 
                    name="heure" 
                    placeholder="9h"
                    defaultValue={iaSuggestion?.heure || ''}
                    required 
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={suggestOptimalCreneau}
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                IA : Proposer un créneau libre optimal
              </Button>
              {iaSuggestion && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-400">
                    💡 Suggestion IA : {iaSuggestion.date} à {iaSuggestion.heure} (créneau optimal sans conflit)
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                  Ajouter l'intervention
                </Button>
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
                  placeholder="Rechercher une intervention (client, type, N°, adresse)..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatut} onValueChange={(value) => setFilterStatut(value as StatutIntervention | 'Tous')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="Planifiée">🔵 Planifiée</SelectItem>
                <SelectItem value="En cours">🟠 En cours</SelectItem>
                <SelectItem value="Terminée">✅ Terminée</SelectItem>
                <SelectItem value="Annulée">❌ Annulée</SelectItem>
                <SelectItem value="À venir">🟡 À venir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vue Calendrier avec onglets */}
      <Card>
        <CardHeader>
          <CardTitle>Vue Calendrier</CardTitle>
          <CardDescription>
            Consultez vos interventions par jour, semaine ou mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={vueCalendrier} onValueChange={(value) => setVueCalendrier(value as VueCalendrier)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jour">Jour</TabsTrigger>
              <TabsTrigger value="semaine">Semaine</TabsTrigger>
              <TabsTrigger value="mois">Mois</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jour" className="space-y-4">
              <div className="flex items-center justify-between">
                <Calendar
                  mode="single"
                  selected={dateSelectionnee}
                  onSelect={(date) => date && setDateSelectionnee(date)}
                  locale={fr}
                  className="rounded-md border"
                />
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold mb-4">
                    Interventions du {format(dateSelectionnee, 'EEEE d MMMM yyyy', { locale: fr })}
                  </h3>
                  <div className="space-y-2">
                    {interventionsParDate.length > 0 ? (
                      interventionsParDate.map((intervention) => (
                        <div key={intervention.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{intervention.heure}</span> - {intervention.client}
                            </div>
                              {getStatutBadge(intervention.statut)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{intervention.intervention}</p>
                          {intervention.adresse && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {intervention.adresse}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Aucune intervention ce jour</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="semaine" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  Semaine du {format(startOfWeek(dateSelectionnee, { locale: fr }), 'd MMM', { locale: fr })} au {format(endOfWeek(dateSelectionnee, { locale: fr }), 'd MMM yyyy', { locale: fr })}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const newDate = new Date(dateSelectionnee);
                    newDate.setDate(newDate.getDate() - 7);
                    setDateSelectionnee(newDate);
                  }}>
                    Semaine précédente
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDateSelectionnee(new Date())}>
                    Aujourd'hui
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const newDate = new Date(dateSelectionnee);
                    newDate.setDate(newDate.getDate() + 7);
                    setDateSelectionnee(newDate);
                  }}>
                    Semaine suivante
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {interventionsParDate.length > 0 ? (
                  interventionsParDate.map((intervention) => (
                    <div key={intervention.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{intervention.date} à {intervention.heure}</span> - {intervention.client}
                        </div>
                        {getStatutBadge(intervention.statut)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{intervention.intervention}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Aucune intervention cette semaine</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="mois" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {format(dateSelectionnee, 'MMMM yyyy', { locale: fr })}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const newDate = new Date(dateSelectionnee);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setDateSelectionnee(newDate);
                  }}>
                    Mois précédent
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDateSelectionnee(new Date())}>
                    Aujourd'hui
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const newDate = new Date(dateSelectionnee);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setDateSelectionnee(newDate);
                  }}>
                    Mois suivant
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={dateSelectionnee}
                onSelect={(date) => date && setDateSelectionnee(date)}
                locale={fr}
                className="rounded-md border"
                modifiers={{
                  hasIntervention: (date) => {
                    return getInterventionsForDate(date).length > 0;
                  },
                }}
                modifiersClassNames={{
                  hasIntervention: 'bg-blue-500/20 text-blue-400',
                }}
              />
              <div className="space-y-2 mt-4">
                <h4 className="font-semibold">Interventions du mois ({interventionsParDate.length})</h4>
                {interventionsParDate.length > 0 ? (
                  interventionsParDate.map((intervention) => (
                    <div key={intervention.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{intervention.date} à {intervention.heure}</span> - {intervention.client}
                        </div>
                        {getStatutBadge(intervention.statut)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{intervention.intervention}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Aucune intervention ce mois</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Vue Agenda (liste) */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des interventions ({filteredInterventions.length})</CardTitle>
          <CardDescription>
            Toutes vos interventions programmées — Rappels SMS/email automatiques 24h avant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type de travail</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterventions.map((intervention) => (
                  <TableRow key={intervention.id}>
                    <TableCell className="font-medium">{intervention.date}</TableCell>
                    <TableCell>{intervention.heure}</TableCell>
                    <TableCell>{intervention.client}</TableCell>
                    <TableCell>{intervention.intervention}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {intervention.adresse || '-'}
                    </TableCell>
                    <TableCell>{intervention.dureeEstimee || '-'}</TableCell>
                    <TableCell>{getStatutBadge(intervention.statut)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {intervention.statut === 'Planifiée' && intervention.telephone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendRappel(intervention.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Rappel
                          </Button>
                        )}
                        <Select
                          value={intervention.statut}
                          onValueChange={(value) => updateStatut(intervention.id, value as StatutIntervention)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Planifiée">🔵 Planifiée</SelectItem>
                            <SelectItem value="En cours">🟠 En cours</SelectItem>
                            <SelectItem value="Terminée">✅ Terminée</SelectItem>
                            <SelectItem value="Annulée">❌ Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredInterventions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune intervention trouvée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rappels internes */}
      {rappelsInternes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rappels internes "Départ chantier"</CardTitle>
            <CardDescription>
              Rappels automatiques 1h avant chaque intervention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rappelsInternes.filter(r => !r.envoye).slice(0, 5).map((rappel) => {
                const intervention = interventions.find(i => i.id === rappel.interventionId);
                return (
                  <div key={rappel.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium">{rappel.message}</p>
                        <p className="text-xs text-muted-foreground">{rappel.date} à {rappel.heure}</p>
                      </div>
                    </div>
                    {intervention && (
                      <Badge variant="outline">
                        {intervention.statut}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info sur les notifications automatiques */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-1">Notifications automatiques</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>SMS/Email client</strong> : Envoyé automatiquement 24h avant chaque intervention planifiée</li>
                <li>• <strong>Rappel interne "départ chantier"</strong> : Notification 1h avant pour ne pas oublier de partir</li>
                <li>• Vous pouvez aussi envoyer un rappel manuel en cliquant sur "Rappel" dans le tableau</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
