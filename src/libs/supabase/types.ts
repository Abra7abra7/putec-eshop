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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          max_guests: number | null
          name: string
          price_per_night_cents: number | null
          stripe_product_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          max_guests?: number | null
          name: string
          price_per_night_cents?: number | null
          stripe_product_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          max_guests?: number | null
          name?: string
          price_per_night_cents?: number | null
          stripe_product_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          price_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: number
          order_id: number
          price_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: number
          order_id?: number
          price_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          email: string | null
          id: number
          order_type: string | null
          status: string
          stripe_session_id: string
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          order_type?: string | null
          status?: string
          stripe_session_id: string
          total_amount: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          order_type?: string | null
          status?: string
          stripe_session_id?: string
          total_amount?: number
          user_id?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          product_id: string | null
          type: string | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          metadata?: Json | null
          product_id?: string | null
          type?: string | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          product_id?: string | null
          type?: string | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          alcohol_content: number | null
          description: string | null
          gs1_code: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
          region: string | null
          stock_quantity: number | null
          sweetness_level: string | null
          vintage: number | null
          wine_category_id: number | null
        }
        Insert: {
          active?: boolean | null
          alcohol_content?: number | null
          description?: string | null
          gs1_code?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
          region?: string | null
          stock_quantity?: number | null
          sweetness_level?: string | null
          vintage?: number | null
          wine_category_id?: number | null
        }
        Update: {
          active?: boolean | null
          alcohol_content?: number | null
          description?: string | null
          gs1_code?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
          region?: string | null
          stock_quantity?: number | null
          sweetness_level?: string | null
          vintage?: number | null
          wine_category_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_wine_category_id_fkey"
            columns: ["wine_category_id"]
            isOneToOne: false
            referencedRelation: "wine_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          accommodation_id: number | null
          check_in_date: string
          check_out_date: string
          created_at: string | null
          guest_count: number
          id: number
          status: string | null
          stripe_session_id: string | null
          total_price_cents: number
          user_id: string | null
        }
        Insert: {
          accommodation_id?: number | null
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          guest_count: number
          id?: number
          status?: string | null
          stripe_session_id?: string | null
          total_price_cents: number
          user_id?: string | null
        }
        Update: {
          accommodation_id?: number | null
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          guest_count?: number
          id?: number
          status?: string | null
          stripe_session_id?: string | null
          total_price_cents?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      tasting_bookings: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: number
          number_of_people: number
          session_id: number | null
          special_requests: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          total_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: number
          number_of_people?: number
          session_id?: number | null
          special_requests?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: number
          number_of_people?: number
          session_id?: number | null
          special_requests?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasting_bookings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "tasting_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tasting_packages: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: number
          includes_accommodation: boolean | null
          includes_food: boolean | null
          max_people: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: number
          includes_accommodation?: boolean | null
          includes_food?: boolean | null
          max_people?: number
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: number
          includes_accommodation?: boolean | null
          includes_food?: boolean | null
          max_people?: number
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tasting_sessions: {
        Row: {
          created_at: string | null
          current_bookings: number | null
          end_time: string
          id: number
          max_capacity: number
          notes: string | null
          package_id: number | null
          start_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_bookings?: number | null
          end_time: string
          id?: number
          max_capacity: number
          notes?: string | null
          package_id?: number | null
          start_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_bookings?: number | null
          end_time?: string
          id?: number
          max_capacity?: number
          notes?: string | null
          package_id?: number | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasting_sessions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "tasting_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      tastings: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
          price_cents: number | null
          stripe_product_id: string | null
          wine_count: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price_cents?: number | null
          stripe_product_id?: string | null
          wine_count: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price_cents?: number | null
          stripe_product_id?: string | null
          wine_count?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: []
      }
      wine_categories: {
        Row: {
          color: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_available_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
