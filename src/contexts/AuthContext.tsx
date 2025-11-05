import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  nom: string;
  email: string;
  role: 'courtier' | 'client';
  telephone?: string;
  entreprise?: string;
  photo_profil?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInMock: (email: string, password: string, role: 'courtier' | 'client') => Promise<void>;
  signUpMock: (email: string, password: string, nom: string, role: 'courtier' | 'client') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clés pour localStorage
const MOCK_USER_KEY = 'mock_user';
const MOCK_PROFILE_KEY = 'mock_profile';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fonction pour créer un utilisateur mock
  const createMockUser = (email: string, nom: string, role: 'courtier' | 'client'): { user: User; profile: Profile } => {
    const mockUserId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const mockUser: User = {
      id: mockUserId,
      email: email,
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        nom: nom,
        role: role,
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_anonymous: false,
    };

    const mockProfile: Profile = {
      id: mockUserId,
      nom: nom,
      email: email,
      role: role,
      telephone: '',
      entreprise: role === 'courtier' ? 'Mon Entreprise' : undefined,
    };

    return { user: mockUser, profile: mockProfile };
  };

  // Fonction de connexion mockée
  const signInMock = async (email: string, password: string, role: 'courtier' | 'client') => {
    // Pour le mode mock, on accepte n'importe quelle combinaison
    // On crée ou récupère un utilisateur mock
    const storedProfile = localStorage.getItem(MOCK_PROFILE_KEY);
    
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      if (parsedProfile.email === email && parsedProfile.role === role) {
        // Utilisateur existant
        const storedUser = localStorage.getItem(MOCK_USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setProfile(parsedProfile);
          setSession({
            access_token: 'mock-token',
            token_type: 'bearer',
            expires_in: 3600,
            expires_at: Date.now() / 1000 + 3600,
            refresh_token: 'mock-refresh',
            user: JSON.parse(storedUser),
          } as Session);
          return;
        }
      }
    }

    // Nouvel utilisateur mock
    const { user: mockUser, profile: mockProfile } = createMockUser(
      email,
      email.split('@')[0] || 'Utilisateur',
      role
    );

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(mockProfile));

    setUser(mockUser);
    setProfile(mockProfile);
    setSession({
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      refresh_token: 'mock-refresh',
      user: mockUser,
    } as Session);
  };

  // Fonction d'inscription mockée
  const signUpMock = async (email: string, password: string, nom: string, role: 'courtier' | 'client') => {
    const { user: mockUser, profile: mockProfile } = createMockUser(email, nom, role);

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(mockProfile));

    setUser(mockUser);
    setProfile(mockProfile);
    setSession({
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      refresh_token: 'mock-refresh',
      user: mockUser,
    } as Session);
  };

  useEffect(() => {
    // Vérifier d'abord si on a un utilisateur mock dans localStorage
    const storedUser = localStorage.getItem(MOCK_USER_KEY);
    const storedProfile = localStorage.getItem(MOCK_PROFILE_KEY);

    if (storedUser && storedProfile) {
      try {
        const mockUser = JSON.parse(storedUser);
        const mockProfile = JSON.parse(storedProfile);
        
        setUser(mockUser);
        setProfile(mockProfile);
        setSession({
          access_token: 'mock-token',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Date.now() / 1000 + 3600,
          refresh_token: 'mock-refresh',
          user: mockUser,
        } as Session);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error loading mock user:', error);
      }
    }

    // Sinon, essayer avec Supabase (mais ne pas bloquer si ça échoue)
    try {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile when session changes
          if (session?.user) {
            setTimeout(() => {
              fetchProfile(session.user.id);
            }, 0);
          } else {
            setProfile(null);
          }
        }
      );

      // Check for existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      // Si Supabase n'est pas configuré, on continue en mode mock
      console.warn('Supabase not configured, using mock mode');
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Si ça échoue, on ne bloque pas l'app
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Ignorer les erreurs Supabase
    }
    
    // Nettoyer le localStorage
    localStorage.removeItem(MOCK_USER_KEY);
    localStorage.removeItem(MOCK_PROFILE_KEY);
    
    setUser(null);
    setSession(null);
    setProfile(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, signInMock, signUpMock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
