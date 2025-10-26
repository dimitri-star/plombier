import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      navigate('/welcome', { replace: true });
    }
  }, [user, profile, navigate]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>, role: 'courtier' | 'client') => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nom = formData.get('nom') as string;

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nom: nom || 'Utilisateur',
              role: role,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: 'Compte créé !',
          description: 'Vous pouvez maintenant vous connecter.',
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: 'Connexion réussie !',
          description: 'Redirection en cours...',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-button-custom {
          padding: 12px 30px;
          border-radius: 50px;
          cursor: pointer;
          border: 0;
          background-color: white;
          box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-size: 13px;
          transition: all 0.5s ease;
          color: #000;
          width: 100%;
          font-weight: 600;
        }

        .auth-button-custom:hover {
          letter-spacing: 3px;
          background-color: #ff8c00;
          color: white;
          box-shadow: rgba(255, 140, 0, 0.5) 0px 7px 29px 0px;
        }

        .auth-button-custom:active {
          letter-spacing: 3px;
          background-color: #ff8c00;
          color: white;
          box-shadow: rgba(255, 140, 0, 0.3) 0px 0px 0px 0px;
          transform: translateY(10px);
          transition: 100ms;
        }

        .auth-button-custom:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        input[type="password"] {
          color: white !important;
        }

        input[type="password"]::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Courtier Pro Flow</h1>
          <p className="mt-2 text-muted-foreground">
            Plateforme de gestion pour courtiers professionnels
          </p>
        </div>

        {!isSignUp ? (
          <Tabs defaultValue="courtier" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courtier">Espace Courtier</TabsTrigger>
              <TabsTrigger value="client">Espace Client</TabsTrigger>
            </TabsList>

            <TabsContent value="courtier">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion Courtier</CardTitle>
                  <CardDescription>
                    Accédez à votre espace de gestion complet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleAuth(e, 'courtier')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="courtier-email">Email</Label>
                      <Input
                        id="courtier-email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courtier-password">Mot de passe</Label>
                      <Input
                        id="courtier-password"
                        name="password"
                        type="password"
                        placeholder="Votre mot de passe"
                        className="text-white"
                        required
                      />
                    </div>
                    <button type="submit" className="auth-button-custom" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
                      Se connecter
                    </button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="client">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion Client</CardTitle>
                  <CardDescription>
                    Suivez l'avancement de votre dossier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleAuth(e, 'client')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email</Label>
                      <Input
                        id="client-email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-password">Mot de passe</Label>
                      <Input
                        id="client-password"
                        name="password"
                        type="password"
                        placeholder="Votre mot de passe"
                        className="text-white"
                        required
                      />
                    </div>
                    <button type="submit" className="auth-button-custom" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
                      Se connecter
                    </button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Créer un compte</CardTitle>
              <CardDescription>
                Choisissez votre type de compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="courtier">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="courtier">Courtier</TabsTrigger>
                  <TabsTrigger value="client">Client</TabsTrigger>
                </TabsList>

                <TabsContent value="courtier">
                  <form onSubmit={(e) => handleAuth(e, 'courtier')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-courtier-nom">Nom complet</Label>
                      <Input
                        id="signup-courtier-nom"
                        name="nom"
                        type="text"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-courtier-email">Email</Label>
                      <Input
                        id="signup-courtier-email"
                        name="email"
                        type="email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-courtier-password">Mot de passe</Label>
                      <Input
                        id="signup-courtier-password"
                        name="password"
                        type="password"
                        placeholder="Votre mot de passe"
                        className="text-white"
                        required
                      />
                    </div>
                    <button type="submit" className="auth-button-custom" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
                      Créer mon compte courtier
                    </button>
                  </form>
                </TabsContent>

                <TabsContent value="client">
                  <form onSubmit={(e) => handleAuth(e, 'client')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-client-nom">Nom complet</Label>
                      <Input
                        id="signup-client-nom"
                        name="nom"
                        type="text"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-client-email">Email</Label>
                      <Input
                        id="signup-client-email"
                        name="email"
                        type="email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-client-password">Mot de passe</Label>
                      <Input
                        id="signup-client-password"
                        name="password"
                        type="password"
                        placeholder="Votre mot de passe"
                        className="text-white"
                        required
                      />
                    </div>
                    <button type="submit" className="auth-button-custom" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
                      Créer mon compte client
                    </button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-base font-medium hover:underline"
          >
            {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas encore de compte ? S\'inscrire'}
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
