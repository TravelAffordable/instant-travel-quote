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
      areas: {
        Row: {
          created_at: string
          description: string | null
          destination: Database["public"]["Enums"]["destination_code"]
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          destination: Database["public"]["Enums"]["destination_code"]
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          destination?: Database["public"]["Enums"]["destination_code"]
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      hotels: {
        Row: {
          address: string | null
          area_id: string
          created_at: string
          id: string
          includes_breakfast: boolean
          is_active: boolean
          name: string
          notes: string | null
          star_rating: number | null
          tier: Database["public"]["Enums"]["price_tier"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          area_id: string
          created_at?: string
          id?: string
          includes_breakfast?: boolean
          is_active?: boolean
          name: string
          notes?: string | null
          star_rating?: number | null
          tier: Database["public"]["Enums"]["price_tier"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          area_id?: string
          created_at?: string
          id?: string
          includes_breakfast?: boolean
          is_active?: boolean
          name?: string
          notes?: string | null
          star_rating?: number | null
          tier?: Database["public"]["Enums"]["price_tier"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotels_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_history: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          recorded_date: string
          room_type_id: string
          source: string | null
          weekday_rate: number | null
          weekend_rate: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          recorded_date?: string
          room_type_id: string
          source?: string | null
          weekday_rate?: number | null
          weekend_rate?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          recorded_date?: string
          room_type_id?: string
          source?: string | null
          weekday_rate?: number | null
          weekend_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rate_history_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_overrides: {
        Row: {
          created_at: string
          id: string
          override_date: string
          rate: number
          reason: string | null
          room_type_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          override_date: string
          rate: number
          reason?: string | null
          room_type_id: string
        }
        Update: {
          created_at?: string
          id?: string
          override_date?: string
          rate?: number
          reason?: string | null
          room_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rate_overrides_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_rates: {
        Row: {
          base_rate_weekday: number
          base_rate_weekend: number
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          room_type_id: string
          updated_at: string
        }
        Insert: {
          base_rate_weekday: number
          base_rate_weekend: number
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          room_type_id: string
          updated_at?: string
        }
        Update: {
          base_rate_weekday?: number
          base_rate_weekend?: number
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          room_type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_rates_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          capacity: Database["public"]["Enums"]["room_capacity"]
          created_at: string
          hotel_id: string
          id: string
          is_active: boolean
          max_adults: number
          max_children: number
          name: string
          updated_at: string
        }
        Insert: {
          capacity: Database["public"]["Enums"]["room_capacity"]
          created_at?: string
          hotel_id: string
          id?: string
          is_active?: boolean
          max_adults?: number
          max_children?: number
          name: string
          updated_at?: string
        }
        Update: {
          capacity?: Database["public"]["Enums"]["room_capacity"]
          created_at?: string
          hotel_id?: string
          id?: string
          is_active?: boolean
          max_adults?: number
          max_children?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_types_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_periods: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_active: boolean
          multiplier: number
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          multiplier?: number
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          multiplier?: number
          name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_room_rate: {
        Args: { p_date: string; p_room_type_id: string }
        Returns: number
      }
      get_stay_cost: {
        Args: {
          p_check_in: string
          p_check_out: string
          p_room_type_id: string
        }
        Returns: number
      }
    }
    Enums: {
      destination_code:
        | "durban"
        | "cape_town"
        | "sun_city"
        | "mpumalanga"
        | "hartbeespoort"
        | "magaliesburg"
        | "vaal"
      price_tier: "budget" | "affordable" | "premium"
      room_capacity: "2_sleeper" | "4_sleeper"
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
      destination_code: [
        "durban",
        "cape_town",
        "sun_city",
        "mpumalanga",
        "hartbeespoort",
        "magaliesburg",
        "vaal",
      ],
      price_tier: ["budget", "affordable", "premium"],
      room_capacity: ["2_sleeper", "4_sleeper"],
    },
  },
} as const
