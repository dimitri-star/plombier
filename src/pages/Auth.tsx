import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('signup') === 'true');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile, signInMock, signUpMock } = useAuth();

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
        await signUpMock(email, password, nom || 'Utilisateur', role);
        toast({
          title: 'Compte créé !',
          description: 'Redirection en cours...',
        });
        // Rediriger après un court délai
        setTimeout(() => {
          navigate('/welcome');
        }, 1000);
      } else {
        await signInMock(email, password, role);
        toast({
          title: 'Connexion réussie !',
          description: 'Redirection en cours...',
        });
        // Rediriger après un court délai
        setTimeout(() => {
          navigate('/welcome');
        }, 1000);
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
        <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Connexion Plombier</h1>
        </div>

        {!isSignUp ? (
          <Card>
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleAuth(e, 'courtier')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Créer un compte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleAuth(e, 'courtier')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-nom">Nom complet</Label>
                  <Input
                    id="signup-nom"
                    name="nom"
                    type="text"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Votre mot de passe"
                    className="text-white"
                    required
                  />
                </div>
                <button type="submit" className="auth-button-custom" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
                  Créer mon compte
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-base font-medium hover:underline"
          >
            {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas encore de compte ? Créez-en un'}
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
