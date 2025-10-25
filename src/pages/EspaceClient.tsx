import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, MessageSquare, Phone, Mail, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function EspaceClient() {
  const { profile, signOut } = useAuth();
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDossier();
  }, [profile]);

  const fetchDossier = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('dossiers')
        .select('*')
        .eq('client_id', profile.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setDossier(data);
    } catch (error) {
      console.error('Error fetching dossier:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'en_attente': return 20;
      case 'documents_recus': return 40;
      case 'en_analyse': return 60;
      case 'accepte': return 100;
      case 'refuse': return 100;
      default: return 0;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'documents_recus': return 'Documents reçus';
      case 'en_analyse': return 'En analyse';
      case 'accepte': return 'Accepté';
      case 'refuse': return 'Refusé';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepte': return 'bg-success text-success-foreground';
      case 'refuse': return 'bg-destructive text-destructive-foreground';
      case 'en_analyse': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Courtier Pro Flow</h1>
            <p className="text-sm text-muted-foreground">Espace Client</p>
          </div>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Bonjour {profile?.nom} !</h2>
          <p className="text-muted-foreground">
            Suivez l'évolution de votre dossier en temps réel
          </p>
        </div>

        {!dossier ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucun dossier actif</h3>
              <p className="mt-2 text-muted-foreground">
                Votre courtier n'a pas encore créé de dossier pour vous.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Dossier Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{dossier.titre}</CardTitle>
                  <Badge className={getStatusColor(dossier.statut)}>
                    {getStatusLabel(dossier.statut)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{getStatusProgress(dossier.statut)}%</span>
                  </div>
                  <Progress value={getStatusProgress(dossier.statut)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Type de dossier</p>
                    <p className="font-medium">{dossier.type_dossier || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Montant</p>
                    <p className="font-medium">
                      {dossier.montant ? `${dossier.montant.toLocaleString('fr-FR')} €` : 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Pièce d'identité</p>
                        <p className="text-sm text-muted-foreground">En attente</p>
                      </div>
                    </div>
                    <Button size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Déposer
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Justificatif de domicile</p>
                        <p className="text-sm text-muted-foreground">En attente</p>
                      </div>
                    </div>
                    <Button size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Déposer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Votre courtier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {profile?.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">Votre conseiller dédié</p>
                    <p className="text-sm text-muted-foreground">Disponible pour vous accompagner</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Phone className="mr-2 h-4 w-4" />
                    Appeler
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
