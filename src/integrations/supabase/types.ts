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
      customer_loyalty: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          points: number
          service_count: number
          tier: string
          total_spent_usdc: number
          updated_at: string
          wash_count: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          points?: number
          service_count?: number
          tier?: string
          total_spent_usdc?: number
          updated_at?: string
          wash_count?: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          points?: number
          service_count?: number
          tier?: string
          total_spent_usdc?: number
          updated_at?: string
          wash_count?: number
        }
        Relationships: []
      }
      operator_rewards: {
        Row: {
          created_at: string
          earned_usdc: number
          id: string
          job_count: number
          operator_id: string
          paid_usdc: number
          pending_usdc: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          earned_usdc?: number
          id?: string
          job_count?: number
          operator_id: string
          paid_usdc?: number
          pending_usdc?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          earned_usdc?: number
          id?: string
          job_count?: number
          operator_id?: string
          paid_usdc?: number
          pending_usdc?: number
          updated_at?: string
        }
        Relationships: []
      }
      payment_sessions: {
        Row: {
          amount: number
          asset: string
          created_at: string
          customer_id: string | null
          id: string
          resource: string
          settled_at: string | null
          status: string
          tx_hash: string | null
        }
        Insert: {
          amount: number
          asset?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          resource: string
          settled_at?: string | null
          status?: string
          tx_hash?: string | null
        }
        Update: {
          amount?: number
          asset?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          resource?: string
          settled_at?: string | null
          status?: string
          tx_hash?: string | null
        }
        Relationships: []
      }
      service_sessions: {
        Row: {
          branch_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          mileage: number | null
          operator_id: string
          payment_session_id: string | null
          price_usdc: number
          service_type: string
          status: string
          vehicle_id: string
        }
        Insert: {
          branch_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          mileage?: number | null
          operator_id: string
          payment_session_id?: string | null
          price_usdc: number
          service_type?: string
          status?: string
          vehicle_id: string
        }
        Update: {
          branch_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          mileage?: number | null
          operator_id?: string
          payment_session_id?: string | null
          price_usdc?: number
          service_type?: string
          status?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_sessions_payment_session_id_fkey"
            columns: ["payment_session_id"]
            isOneToOne: false
            referencedRelation: "payment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      wash_sessions: {
        Row: {
          branch_id: string
          completed_at: string | null
          created_at: string
          id: string
          operator_id: string
          payment_session_id: string | null
          price_usdc: number
          status: string
          vehicle_id: string
          wash_type: string
        }
        Insert: {
          branch_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          operator_id: string
          payment_session_id?: string | null
          price_usdc: number
          status?: string
          vehicle_id: string
          wash_type?: string
        }
        Update: {
          branch_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          operator_id?: string
          payment_session_id?: string | null
          price_usdc?: number
          status?: string
          vehicle_id?: string
          wash_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wash_sessions_payment_session_id_fkey"
            columns: ["payment_session_id"]
            isOneToOne: false
            referencedRelation: "payment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
