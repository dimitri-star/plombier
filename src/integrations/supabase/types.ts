export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      automatisations: {
        Row: {
          actif: boolean | null
          action: string
          created_at: string
          declencheur: string
          delai: number | null
          id: string
          nom_automation: string
        }
        Insert: {
          actif?: boolean | null
          action: string
          created_at?: string
          declencheur: string
          delai?: number | null
          id?: string
          nom_automation: string
        }
        Update: {
          actif?: boolean | null
          action?: string
          created_at?: string
          declencheur?: string
          delai?: number | null
          id?: string
          nom_automation?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          created_at: string
          date_versement: string | null
          dossier_id: string
          id: string
          montant: number
          note: string | null
          partenaire: string | null
          statut: string | null
        }
        Insert: {
          created_at?: string
          date_versement?: string | null
          dossier_id: string
          id?: string
          montant: number
          note?: string | null
          partenaire?: string | null
          statut?: string | null
        }
        Update: {
          created_at?: string
          date_versement?: string | null
          dossier_id?: string
          id?: string
          montant?: number
          note?: string | null
          partenaire?: string | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          dossier_id: string
          envoye_par: string | null
          etat: string | null
          id: string
          nom_document: string
          type_document: string | null
          url_fichier: string
        }
        Insert: {
          created_at?: string
          dossier_id: string
          envoye_par?: string | null
          etat?: string | null
          id?: string
          nom_document: string
          type_document?: string | null
          url_fichier: string
        }
        Update: {
          created_at?: string
          dossier_id?: string
          envoye_par?: string | null
          etat?: string | null
          id?: string
          nom_document?: string
          type_document?: string | null
          url_fichier?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_envoye_par_fkey"
            columns: ["envoye_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dossiers: {
        Row: {
          banque_partenaire: string | null
          client_id: string | null
          courtier_id: string
          created_at: string
          id: string
          montant: number | null
          note_interne: string | null
          statut: Database["public"]["Enums"]["statut_dossier"]
          titre: string
          type_dossier: string | null
          updated_at: string
        }
        Insert: {
          banque_partenaire?: string | null
          client_id?: string | null
          courtier_id: string
          created_at?: string
          id?: string
          montant?: number | null
          note_interne?: string | null
          statut?: Database["public"]["Enums"]["statut_dossier"]
          titre: string
          type_dossier?: string | null
          updated_at?: string
        }
        Update: {
          banque_partenaire?: string | null
          client_id?: string | null
          courtier_id?: string
          created_at?: string
          id?: string
          montant?: number | null
          note_interne?: string | null
          statut?: Database["public"]["Enums"]["statut_dossier"]
          titre?: string
          type_dossier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossiers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_courtier_id_fkey"
            columns: ["courtier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          contenu: string
          created_at: string
          destinataire_id: string | null
          dossier_id: string
          expediteur_id: string | null
          id: string
          lu: boolean | null
        }
        Insert: {
          contenu: string
          created_at?: string
          destinataire_id?: string | null
          dossier_id: string
          expediteur_id?: string | null
          id?: string
          lu?: boolean | null
        }
        Update: {
          contenu?: string
          created_at?: string
          destinataire_id?: string | null
          dossier_id?: string
          expediteur_id?: string | null
          id?: string
          lu?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_destinataire_id_fkey"
            columns: ["destinataire_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_expediteur_id_fkey"
            columns: ["expediteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partenaires: {
        Row: {
          contact_email: string | null
          contact_nom: string | null
          contact_telephone: string | null
          created_at: string
          id: string
          nom_partenaire: string
          notes: string | null
          type_partenaire: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_nom?: string | null
          contact_telephone?: string | null
          created_at?: string
          id?: string
          nom_partenaire: string
          notes?: string | null
          type_partenaire?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_nom?: string | null
          contact_telephone?: string | null
          created_at?: string
          id?: string
          nom_partenaire?: string
          notes?: string | null
          type_partenaire?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          entreprise: string | null
          id: string
          nom: string
          photo_profil: string | null
          role: Database["public"]["Enums"]["app_role"]
          telephone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          entreprise?: string | null
          id: string
          nom: string
          photo_profil?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          entreprise?: string | null
          id?: string
          nom?: string
          photo_profil?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      relances: {
        Row: {
          created_at: string
          date_programmee: string
          dossier_id: string
          id: string
          message_modele: string | null
          statut: string | null
          type_relance: Database["public"]["Enums"]["type_relance"]
        }
        Insert: {
          created_at?: string
          date_programmee: string
          dossier_id: string
          id?: string
          message_modele?: string | null
          statut?: string | null
          type_relance: Database["public"]["Enums"]["type_relance"]
        }
        Update: {
          created_at?: string
          date_programmee?: string
          dossier_id?: string
          id?: string
          message_modele?: string | null
          statut?: string | null
          type_relance?: Database["public"]["Enums"]["type_relance"]
        }
        Relationships: [
          {
            foreignKeyName: "relances_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_courtier: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "courtier" | "client"
      statut_dossier:
        | "en_attente"
        | "documents_recus"
        | "en_analyse"
        | "accepte"
        | "refuse"
      type_relance: "email" | "sms" | "appel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["courtier", "client"],
      statut_dossier: [
        "en_attente",
        "documents_recus",
        "en_analyse",
        "accepte",
        "refuse",
      ],
      type_relance: ["email", "sms", "appel"],
    },
  },
} as const
