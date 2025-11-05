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
import { Search, MessageSquare, Bot, Send, Sparkles, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageIA {
  id: string;
  client: string;
  message: string;
  date: string;
  type: 'rappel-rdv' | 'devis-envoye' | 'relance-devis' | 'relance-paiement' | 'confirmation' | 'faq';
}

interface RelanceProgrammee {
  id: string;
  client: string;
  type: 'rappel-rdv' | 'relance-devis' | 'relance-paiement';
  dateProgrammee: string;
  heureProgrammee: string;
  message: string;
  statut: 'programmé' | 'envoyé';
}

interface SuggestionIA {
  texte: string;
  contexte: string;
}

export default function Documents() {
  const { toast } = useToast();

  // Données factices : historique des messages IA
  const [messagesIA, setMessagesIA] = useState<MessageIA[]>([
    {
      id: 'M-001',
      client: 'Mme Colin',
      message: 'Bonjour Mme Colin, rappel : votre intervention est prévue demain à 9h. Merci de confirmer votre présence.',
      date: '04/11',
      type: 'rappel-rdv',
    },
    {
      id: 'M-002',
      client: 'M. Leroy',
      message: 'Bonjour M. Leroy, votre devis a été envoyé. N\'hésitez pas si vous avez des questions. Cordialement.',
      date: '03/11',
      type: 'devis-envoye',
    },
    {
      id: 'M-003',
      client: 'M. Giraud',
      message: 'Bonjour M. Giraud, avez-vous eu le temps de consulter le devis envoyé ? Je reste disponible pour toute question.',
      date: '02/11',
      type: 'relance-devis',
    },
    {
      id: 'M-004',
      client: 'ImmoLyon',
      message: 'Bonjour, votre facture du 01/11 est en attente de règlement. Merci de procéder au paiement dans les meilleurs délais.',
      date: '01/11',
      type: 'relance-paiement',
    },
  ]);

  // Relances automatiques programmées
  const [relancesProgrammees, setRelancesProgrammees] = useState<RelanceProgrammee[]>([
    {
      id: 'R-001',
      client: 'Mme Colin',
      type: 'rappel-rdv',
      dateProgrammee: '05/11',
      heureProgrammee: '08h00',
      message: 'Rappel : intervention demain à 9h.',
      statut: 'programmé',
    },
    {
      id: 'R-002',
      client: 'M. Martin',
      type: 'relance-devis',
      dateProgrammee: '06/11',
      heureProgrammee: '10h00',
      message: 'Avez-vous eu le temps de consulter le devis ?',
      statut: 'programmé',
    },
    {
      id: 'R-003',
      client: 'M. Dubois',
      type: 'relance-paiement',
      dateProgrammee: '07/11',
      heureProgrammee: '14h00',
      message: 'Rappel : facture en attente de règlement.',
      statut: 'programmé',
    },
  ]);

  // Chat IA FAQ
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Bonjour ! Je suis votre assistant IA. Posez-moi vos questions fréquentes.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [openChatDialog, setOpenChatDialog] = useState(false);

  // Messages manuels
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Suggestions IA
  const [suggestionsIA, setSuggestionsIA] = useState<SuggestionIA[]>([
    {
      texte: 'Merci pour votre retour, je vous confirme l\'intervention demain à 9h.',
      contexte: 'Confirmation rapide d\'intervention',
    },
    {
      texte: 'Je vous renvoie le devis en pièce jointe.',
      contexte: 'Réenvoi de devis',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'tous' | MessageIA['type']>('tous');

  const filteredMessages = messagesIA.filter((msg) => {
    const matchesSearch = 
      msg.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tous' || msg.type === filterType;
    return matchesSearch && matchesType;
  });

  // Modèles de messages rapides
  const messageTemplates = [
    {
      id: 'template-rappel-rdv',
      name: 'Rappel RDV',
      text: 'Bonjour {client}, rappel : intervention prévue le {date} à {heure}. Merci de confirmer votre présence.',
    },
    {
      id: 'template-devis-envoye',
      name: 'Devis envoyé',
      text: 'Bonjour {client}, votre devis est disponible. N\'hésitez pas si vous avez des questions. Cordialement.',
    },
    {
      id: 'template-relance-devis',
      name: 'Relance devis',
      text: 'Bonjour {client}, avez-vous eu le temps de consulter le devis envoyé ? Je reste disponible pour toute question.',
    },
    {
      id: 'template-relance-paiement',
      name: 'Relance paiement',
      text: 'Bonjour {client}, votre facture du {date} est en attente de règlement. Merci de procéder au paiement dans les meilleurs délais.',
    },
    {
      id: 'template-confirmation',
      name: 'Confirmation intervention',
      text: 'Merci pour votre retour, je vous confirme l\'intervention {date} à {heure}.',
    },
  ];

  // Générer des suggestions IA contextuelles
  const genererSuggestionsIA = () => {
    const nouvellesSuggestions: SuggestionIA[] = [
      {
        texte: 'Merci pour votre retour, je vous confirme l\'intervention demain à 9h.',
        contexte: 'Confirmation rapide d\'intervention',
      },
      {
        texte: 'Je vous renvoie le devis en pièce jointe.',
        contexte: 'Réenvoi de devis',
      },
      {
        texte: 'Parfait, j\'ai bien noté votre disponibilité. Je vous confirme le créneau.',
        contexte: 'Confirmation de disponibilité',
      },
      {
        texte: 'Votre intervention est terminée. La facture sera envoyée sous 24h.',
        contexte: 'Fin d\'intervention',
      },
    ];
    setSuggestionsIA(nouvellesSuggestions);
  };

  const handleChatMessage = () => {
    if (!chatInput.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: chatMessages.length + 1,
      type: 'user' as const,
      message: chatInput,
    };
    setChatMessages([...chatMessages, userMessage]);

    // Réponse automatique IA
    setTimeout(() => {
      let botResponse = 'Je n\'ai pas trouvé de réponse spécifique. Pouvez-vous reformuler votre question ?';
      
      // Vérifier les mots-clés
      const lowerInput = chatInput.toLowerCase();
      if (lowerInput.includes('quand') || lowerInput.includes('date') || lowerInput.includes('heure')) {
        botResponse = 'Votre intervention est planifiée. Consultez votre planning ou contactez-nous pour plus de détails.';
      } else if (lowerInput.includes('prix') || lowerInput.includes('tarif') || lowerInput.includes('coût')) {
        botResponse = 'Les prix sont indiqués sur votre devis. Pour toute précision, je peux vous mettre en contact avec notre équipe.';
      } else if (lowerInput.includes('facture') || lowerInput.includes('paiement')) {
        botResponse = 'Votre facture sera envoyée après l\'intervention. Le délai de paiement est de 30 jours.';
      } else if (lowerInput.includes('devis')) {
        botResponse = 'Votre devis est disponible. Vous pouvez l\'accepter ou le refuser. Il reste valable 30 jours.';
      }

      const botMessage = {
        id: chatMessages.length + 2,
        type: 'bot' as const,
        message: botResponse,
      };
      setChatMessages([...chatMessages, userMessage, botMessage]);
    }, 500);

    setChatInput('');
    // Générer de nouvelles suggestions après l'interaction
    genererSuggestionsIA();
  };

  const handleSendManualMessage = () => {
    if (!selectedClient || !messageText.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs.',
      });
      return;
    }

    // Ajouter le message à l'historique
    const newMessage: MessageIA = {
      id: `M-${String(messagesIA.length + 1).padStart(3, '0')}`,
      client: selectedClient,
      message: messageText,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      type: 'relance-devis',
    };

    setMessagesIA([newMessage, ...messagesIA]);
    
    toast({
      title: 'Message envoyé',
      description: `Message envoyé à ${selectedClient}.`,
    });

    setOpenMessageDialog(false);
    setSelectedClient('');
    setMessageText('');
    setSelectedTemplate('');
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setMessageText(template.text.replace('{client}', selectedClient || '{client}').replace('{date}', 'XX/XX').replace('{heure}', 'XXh'));
      setSelectedTemplate(templateId);
    }
  };

  const utiliserSuggestionIA = (suggestion: SuggestionIA) => {
    setMessageText(suggestion.texte);
    toast({
      title: 'Suggestion appliquée',
      description: 'La suggestion IA a été ajoutée au message. Vous pouvez la modifier avant l\'envoi.',
    });
  };

  const getMessageTypeBadge = (type: MessageIA['type']) => {
    switch (type) {
      case 'rappel-rdv':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">📅 Rappel RDV</Badge>;
      case 'devis-envoye':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">📄 Devis envoyé</Badge>;
      case 'relance-devis':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">🔄 Relance devis</Badge>;
      case 'relance-paiement':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">💰 Relance paiement</Badge>;
      case 'confirmation':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">✅ Confirmation</Badge>;
      case 'faq':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">💬 FAQ</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getRelanceTypeBadge = (type: RelanceProgrammee['type']) => {
    switch (type) {
      case 'rappel-rdv':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">📅 Rappel RDV</Badge>;
      case 'relance-devis':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">🔄 Relance devis</Badge>;
      case 'relance-paiement':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">💰 Relance paiement</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Messages & Communication client</h1>
          <p className="mt-2 text-muted-foreground">
            Centralisez les échanges et automatisez les réponses répétitives — Réduisez les appels de 70%
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bot className="mr-2 h-4 w-4" />
                Chat IA (FAQ)
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Assistant IA - FAQ Automatique</DialogTitle>
                <DialogDescription>
                  Posez vos questions fréquentes, l'IA répond automatiquement
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 border rounded-lg p-4 bg-muted/50">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'user'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Posez votre question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                />
                <Button onClick={handleChatMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={openMessageDialog} onOpenChange={setOpenMessageDialog}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <MessageSquare className="mr-2 h-4 w-4" />
                Envoyer un message personnalisé
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Envoyer un message personnalisé</DialogTitle>
                <DialogDescription>
                  Envoyez un message personnalisé à un client ou utilisez un modèle rapide
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Input
                    id="client"
                    placeholder="Nom du client"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  />
                </div>
                
                {/* Suggestions IA */}
                <div className="space-y-2">
                  <Label>Suggestions IA — Réponses rapides</Label>
                  <div className="grid gap-2">
                    {suggestionsIA.map((suggestion, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">{suggestion.texte}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.contexte}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => utiliserSuggestionIA(suggestion)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Utiliser
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={genererSuggestionsIA}
                    className="w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer de nouvelles suggestions IA
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Modèles rapides</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle..." />
                    </SelectTrigger>
                    <SelectContent>
                      {messageTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tapez votre message..."
                    rows={6}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSendManualMessage} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                  <Button variant="outline" onClick={() => setOpenMessageDialog(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
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
                  placeholder="Rechercher un message (client, contenu)..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'tous' | MessageIA['type'])}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type de message" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                <SelectItem value="rappel-rdv">📅 Rappel RDV</SelectItem>
                <SelectItem value="devis-envoye">📄 Devis envoyé</SelectItem>
                <SelectItem value="relance-devis">🔄 Relance devis</SelectItem>
                <SelectItem value="relance-paiement">💰 Relance paiement</SelectItem>
                <SelectItem value="confirmation">✅ Confirmation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des relances automatiques programmées */}
      <Card>
        <CardHeader>
          <CardTitle>Relances automatiques programmées</CardTitle>
          <CardDescription>
            Messages automatiques IA programmés pour être envoyés aux clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date programmée</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relancesProgrammees.map((relance) => (
                  <TableRow key={relance.id}>
                    <TableCell className="font-medium">{relance.client}</TableCell>
                    <TableCell>{getRelanceTypeBadge(relance.type)}</TableCell>
                    <TableCell>{relance.dateProgrammee}</TableCell>
                    <TableCell>{relance.heureProgrammee}</TableCell>
                    <TableCell className="max-w-md text-sm text-muted-foreground">{relance.message}</TableCell>
                    <TableCell>
                      <Badge className={relance.statut === 'programmé' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                        {relance.statut === 'programmé' ? <><Clock className="h-3 w-3 mr-1" /> Programmé</> : 'Envoyé'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {relancesProgrammees.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune relance programmée
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historique des messages IA */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des échanges clients</CardTitle>
          <CardDescription>
            Tous les messages automatiques envoyés aux clients — Rappels RDV, Devis envoyé, Relances devis/paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Message IA envoyé</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="font-medium">{msg.client}</TableCell>
                    <TableCell className="max-w-md">{msg.message}</TableCell>
                    <TableCell>{getMessageTypeBadge(msg.type)}</TableCell>
                    <TableCell>{msg.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredMessages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun message trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info sur le chat IA */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bot className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-1">Messages automatiques IA</h3>
              <p className="text-sm text-muted-foreground mb-2">
                L'assistant IA envoie automatiquement des messages aux clients pour :
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>Rappel RDV</strong> : Notification 24h avant chaque intervention</li>
                <li><strong>Devis envoyé</strong> : Confirmation d'envoi avec instructions</li>
                <li><strong>Relance devis</strong> : Suivi automatique des devis sans réponse</li>
                <li><strong>Relance paiement</strong> : Rappel pour les factures en attente</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Le chat IA répond aussi automatiquement aux questions fréquentes, réduisant les appels téléphoniques de 70%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
