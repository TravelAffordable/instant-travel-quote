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
    PostgrestVersion: "14.5"
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
      cached_hotel_rates: {
        Row: {
          capacity: string
          crawled_at: string | null
          crawled_rate: number | null
          created_at: string
          destination: string
          hotel_alias: string
          id: string
          includes_breakfast: boolean | null
          is_available: boolean | null
          real_hotel_name: string
          room_type: string | null
          tier: string
          updated_at: string
        }
        Insert: {
          capacity: string
          crawled_at?: string | null
          crawled_rate?: number | null
          created_at?: string
          destination: string
          hotel_alias: string
          id?: string
          includes_breakfast?: boolean | null
          is_available?: boolean | null
          real_hotel_name: string
          room_type?: string | null
          tier: string
          updated_at?: string
        }
        Update: {
          capacity?: string
          crawled_at?: string | null
          crawled_rate?: number | null
          created_at?: string
          destination?: string
          hotel_alias?: string
          id?: string
          includes_breakfast?: boolean | null
          is_available?: boolean | null
          real_hotel_name?: string
          room_type?: string | null
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      featured_hotels: {
        Row: {
          created_at: string
          destination: string
          hotel_name: string
          id: string
        }
        Insert: {
          created_at?: string
          destination: string
          hotel_name: string
          id?: string
        }
        Update: {
          created_at?: string
          destination?: string
          hotel_name?: string
          id?: string
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
      operator_profiles: {
        Row: {
          account_holder: string
          account_number: string
          bank_name: string
          branch_code: string
          company_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          logo_url: string | null
          phone: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_holder?: string
          account_number?: string
          bank_name?: string
          branch_code?: string
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          phone?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_holder?: string
          account_number?: string
          bank_name?: string
          branch_code?: string
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      operator_quotes: {
        Row: {
          accommodation_total: number
          adults: number
          bus_amount: number
          bus_hire_code: string
          check_in: string | null
          check_out: string | null
          children_ages: number[]
          client_email: string
          client_name: string
          client_phone: string
          commission: number
          created_at: string
          destination: string
          flagged: boolean
          grand_total: number
          group_name: string
          hotel_capacity: number
          hotel_name: string
          hotel_rate: number
          hotel_source: string
          id: string
          operator_id: string
          package_ids: string[]
          package_total: number
          reference: string
          rooms: number
          status: string
          superior_room: boolean
          superior_room_notes: string
          updated_at: string
        }
        Insert: {
          accommodation_total?: number
          adults?: number
          bus_amount?: number
          bus_hire_code?: string
          check_in?: string | null
          check_out?: string | null
          children_ages?: number[]
          client_email?: string
          client_name?: string
          client_phone?: string
          commission?: number
          created_at?: string
          destination?: string
          flagged?: boolean
          grand_total?: number
          group_name?: string
          hotel_capacity?: number
          hotel_name?: string
          hotel_rate?: number
          hotel_source?: string
          id?: string
          operator_id: string
          package_ids?: string[]
          package_total?: number
          reference?: string
          rooms?: number
          status?: string
          superior_room?: boolean
          superior_room_notes?: string
          updated_at?: string
        }
        Update: {
          accommodation_total?: number
          adults?: number
          bus_amount?: number
          bus_hire_code?: string
          check_in?: string | null
          check_out?: string | null
          children_ages?: number[]
          client_email?: string
          client_name?: string
          client_phone?: string
          commission?: number
          created_at?: string
          destination?: string
          flagged?: boolean
          grand_total?: number
          group_name?: string
          hotel_capacity?: number
          hotel_name?: string
          hotel_rate?: number
          hotel_source?: string
          id?: string
          operator_id?: string
          package_ids?: string[]
          package_total?: number
          reference?: string
          rooms?: number
          status?: string
          superior_room?: boolean
          superior_room_notes?: string
          updated_at?: string
        }
        Relationships: []
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
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "operator"
      destination_code:
        | "durban"
        | "cape_town"
        | "sun_city"
        | "mpumalanga"
        | "hartbeespoort"
        | "magaliesburg"
        | "vaal"
        | "bela_bela"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "operator"],
      destination_code: [
        "durban",
        "cape_town",
        "sun_city",
        "mpumalanga",
        "hartbeespoort",
        "magaliesburg",
        "vaal",
        "bela_bela",
      ],
      price_tier: ["budget", "affordable", "premium"],
      room_capacity: ["2_sleeper", "4_sleeper"],
    },
  },
} as const
