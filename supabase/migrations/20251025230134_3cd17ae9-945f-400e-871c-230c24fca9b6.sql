-- Créer l'enum pour les rôles
CREATE TYPE public.app_role AS ENUM ('courtier', 'client');

-- Créer l'enum pour les statuts de dossier
CREATE TYPE public.statut_dossier AS ENUM (
  'en_attente',
  'documents_recus',
  'en_analyse',
  'accepte',
  'refuse'
);

-- Créer l'enum pour les types de relance
CREATE TYPE public.type_relance AS ENUM ('email', 'sms', 'appel');

-- Table des profils utilisateurs
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  role public.app_role NOT NULL DEFAULT 'client',
  telephone TEXT,
  entreprise TEXT,
  photo_profil TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des partenaires
CREATE TABLE public.partenaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_partenaire TEXT NOT NULL,
  type_partenaire TEXT,
  contact_nom TEXT,
  contact_email TEXT,
  contact_telephone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des dossiers
CREATE TABLE public.dossiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  courtier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  titre TEXT NOT NULL,
  type_dossier TEXT,
  montant DECIMAL(12, 2),
  statut public.statut_dossier DEFAULT 'en_attente' NOT NULL,
  banque_partenaire TEXT,
  note_interne TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES public.dossiers(id) ON DELETE CASCADE NOT NULL,
  nom_document TEXT NOT NULL,
  url_fichier TEXT NOT NULL,
  type_document TEXT,
  etat TEXT DEFAULT 'en_attente',
  envoye_par UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES public.dossiers(id) ON DELETE CASCADE NOT NULL,
  expediteur_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  destinataire_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des relances
CREATE TABLE public.relances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES public.dossiers(id) ON DELETE CASCADE NOT NULL,
  type_relance public.type_relance NOT NULL,
  message_modele TEXT,
  date_programmee TIMESTAMP WITH TIME ZONE NOT NULL,
  statut TEXT DEFAULT 'programmee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des commissions
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES public.dossiers(id) ON DELETE CASCADE NOT NULL,
  montant DECIMAL(12, 2) NOT NULL,
  statut TEXT DEFAULT 'en_attente',
  date_versement TIMESTAMP WITH TIME ZONE,
  partenaire TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des automatisations
CREATE TABLE public.automatisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_automation TEXT NOT NULL,
  declencheur TEXT NOT NULL,
  action TEXT NOT NULL,
  delai INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partenaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automatisations ENABLE ROW LEVEL SECURITY;

-- Fonction de sécurité pour vérifier le rôle
CREATE OR REPLACE FUNCTION public.is_courtier()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'courtier'
  );
$$;

-- Policies pour profiles (tous peuvent voir leur propre profil)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies pour dossiers
CREATE POLICY "Courtiers can view all dossiers"
  ON public.dossiers FOR SELECT
  USING (public.is_courtier());

CREATE POLICY "Clients can view their own dossiers"
  ON public.dossiers FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Courtiers can create dossiers"
  ON public.dossiers FOR INSERT
  WITH CHECK (public.is_courtier());

CREATE POLICY "Courtiers can update dossiers"
  ON public.dossiers FOR UPDATE
  USING (public.is_courtier());

CREATE POLICY "Courtiers can delete dossiers"
  ON public.dossiers FOR DELETE
  USING (public.is_courtier());

-- Policies pour documents
CREATE POLICY "Courtiers can view all documents"
  ON public.documents FOR SELECT
  USING (public.is_courtier());

CREATE POLICY "Clients can view documents from their dossiers"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dossiers
      WHERE dossiers.id = documents.dossier_id
      AND dossiers.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policies pour messages
CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (
    expediteur_id = auth.uid() OR
    destinataire_id = auth.uid() OR
    public.is_courtier()
  );

CREATE POLICY "Users can create messages"
  ON public.messages FOR INSERT
  WITH CHECK (expediteur_id = auth.uid());

-- Policies pour relances (courtiers uniquement)
CREATE POLICY "Courtiers can manage relances"
  ON public.relances FOR ALL
  USING (public.is_courtier());

-- Policies pour commissions (courtiers uniquement)
CREATE POLICY "Courtiers can manage commissions"
  ON public.commissions FOR ALL
  USING (public.is_courtier());

-- Policies pour partenaires (courtiers uniquement)
CREATE POLICY "Courtiers can manage partenaires"
  ON public.partenaires FOR ALL
  USING (public.is_courtier());

-- Policies pour automatisations (courtiers uniquement)
CREATE POLICY "Courtiers can manage automatisations"
  ON public.automatisations FOR ALL
  USING (public.is_courtier());

-- Fonction pour créer le profil automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nom, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nom', 'Utilisateur'),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::public.app_role, 'client')
  );
  RETURN new;
END;
$$;

-- Trigger pour créer le profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_dossiers_updated_at
  BEFORE UPDATE ON public.dossiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();