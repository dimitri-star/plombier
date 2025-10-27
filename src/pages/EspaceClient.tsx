import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, MessageSquare, Phone, Mail, User, CheckCircle, Clock, XCircle, Eye, AlertCircle, LogOut, Bot, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusSteps = [
  { id: 'en_attente', label: 'En attente', icon: Clock },
  { id: 'en_analyse', label: 'En analyse', icon: Eye },
  { id: 'accepte', label: 'Accepté', icon: CheckCircle },
  { id: 'refuse', label: 'Refusé', icon: XCircle },
];

export default function EspaceClient() {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState([
    { id: 1, type: 'bot', message: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider ?' }
  ]);
  const [userInput, setUserInput] = useState('');

  // Données factices du dossier du client
  const dossierData = {
    type: 'Prêt immobilier',
    montant: 320000,
    banque: 'Crédit Agricole',
    statut: 'en_analyse',
    documents: [
      { nom: 'Pièce d\'identité', statut: 'reçu', date: '2024-01-10' },
      { nom: 'Justificatif de domicile', statut: 'reçu', date: '2024-01-10' },
      { nom: 'Bulletins de salaire', statut: 'reçu', date: '2024-01-12' },
      { nom: 'RIB', statut: 'manquant', date: null },
      { nom: 'Avis d\'imposition', statut: 'manquant', date: null },
    ],
  };

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      auteur: 'Jean Dupont',
      date: '2024-01-15',
      message: 'Votre dossier est actuellement en cours d\'analyse.',
      type: 'courtier',
    },
    {
      id: 2,
      auteur: 'Marie Dubois',
      date: '2024-01-14',
      message: 'Merci pour les bulletins de salaire. Je vais compléter le dossier.',
      type: 'client',
    },
  ]);

  const courtier = {
    nom: 'Jean Dupont',
    telephone: '06 12 34 56 78',
    email: 'jean.dupont@courtier.com',
  };

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(s => s.id === dossierData.statut);
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Succès',
      description: 'Document envoyé avec succès',
    });
    setOpenUploadDialog(false);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMessage = {
      id: messages.length + 1,
      auteur: profile?.nom || 'Client',
      date: new Date().toISOString().split('T')[0],
      message: formData.get('message') as string,
      type: 'client',
    };
    setMessages([newMessage, ...messages]);
    toast({
      title: 'Message envoyé',
      description: 'Votre message a été envoyé au courtier',
    });
    setOpenMessageDialog(false);
  };

  const handleChatbotSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: chatbotMessages.length + 1,
      type: 'user' as const,
      message: userInput,
    };
    setChatbotMessages([...chatbotMessages, userMessage]);

    // Réponse automatique du chatbot
    setTimeout(() => {
      const botResponses = {
        'hello': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        'bonjour': 'Bonjour ! Je suis là pour répondre à vos questions.',
        'dossier': 'Pour toute question concernant votre dossier, je recommande de contacter directement votre courtier référent ou d\'utiliser la messagerie.',
        'temps': 'Le traitement de votre dossier prend généralement entre 7 à 15 jours ouvrés selon la complexité.',
        'documents': 'Vous pouvez déposer vos documents via le bouton "Ajouter un document" dans la section Documents.',
      };

      const lowerInput = userInput.toLowerCase();
      let botResponse = 'Merci pour votre question. Pour des informations détaillées, je vous recommande de contacter votre courtier référent.';
      
      for (const [key, response] of Object.entries(botResponses)) {
        if (lowerInput.includes(key)) {
          botResponse = response;
          break;
        }
      }

      const botMessage = {
        id: chatbotMessages.length + 2,
        type: 'bot' as const,
        message: botResponse,
      };
      setChatbotMessages(prev => [...prev, botMessage]);
    }, 500);

    setUserInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* En-tête */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">Courtier Pro Flow</div>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Espace Client</span>
          </div>
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{profile?.nom}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Notification si dossier mis à jour */}
        {dossierData.statut === 'en_analyse' && (
          <Card className="border-blue-600 bg-blue-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-200">Dossier mis à jour</h3>
                  <p className="text-sm text-blue-300 mt-1">
                    Votre dossier est actuellement en cours d'analyse par notre équipe.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informations du dossier */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Mon dossier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-300">Type de dossier</p>
                <p className="font-semibold text-white">{dossierData.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Montant</p>
                <p className="font-semibold text-white">{dossierData.montant.toLocaleString('fr-FR')} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Banque partenaire</p>
                <p className="font-semibold text-white">{dossierData.banque}</p>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-4 text-white">Statut du dossier</p>
              <div className="flex items-center gap-2">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= getCurrentStepIndex();
                  const isCurrent = index === getCurrentStepIndex();
                  
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className={`rounded-full p-2 ${
                          isActive 
                            ? isCurrent 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-2 ${
                          isActive ? 'bg-green-600' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
              <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Ajouter un document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un document</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file">Fichier</Label>
                      <Input id="file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        <Upload className="mr-2 h-4 w-4" />
                        Envoyer
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setOpenUploadDialog(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dossierData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg bg-gray-700">
                  <div className="flex items-center gap-3">
                    {doc.statut === 'reçu' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-400" />
                    )}
                    <div>
                      <p className="font-medium text-white">{doc.nom}</p>
                      {doc.date && (
                        <p className="text-sm text-gray-300">
                          Reçu le {new Date(doc.date).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={doc.statut === 'reçu' ? 'default' : 'secondary'}>
                    {doc.statut === 'reçu' ? 'Reçu' : 'En attente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messagerie */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="h-5 w-5" />
                Messagerie
              </CardTitle>
              <Dialog open={openMessageDialog} onOpenChange={setOpenMessageDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Nouveau message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouveau message</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message">Votre message</Label>
                      <Textarea id="message" name="message" rows={4} required />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">Envoyer</Button>
                      <Button type="button" variant="outline" onClick={() => setOpenMessageDialog(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg border ${
                      msg.type === 'client'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-gray-600 text-white border-gray-500'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{msg.auteur}</div>
                    <div className="text-sm">{msg.message}</div>
                    <div className={`text-xs mt-2 ${
                      msg.type === 'client' ? 'text-blue-200' : 'text-gray-300'
                    }`}>
                      {new Date(msg.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coordonnées du courtier */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              Votre courtier référent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-300" />
                <span className="font-medium text-white">{courtier.nom}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-300" />
                <a href={`tel:${courtier.telephone}`} className="text-sm text-blue-400 hover:text-blue-300">
                  {courtier.telephone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-300" />
                <a href={`mailto:${courtier.email}`} className="text-sm text-blue-400 hover:text-blue-300">
                  {courtier.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Widget Chatbot */}
      {!chatbotOpen ? (
        <Button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      ) : (
        <div className="fixed bottom-6 right-6 w-96 shadow-2xl rounded-lg border border-gray-600 bg-gray-800 z-50 flex flex-col" style={{ height: '500px' }}>
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Assistant virtuel</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatbotOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-700">
            {chatbotMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-600 border border-gray-500'
                    }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleChatbotSend} className="p-4 border-t border-gray-600 bg-gray-800 rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
