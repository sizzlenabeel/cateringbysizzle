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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          menu_id: string
          quantity: number
          selected_sub_products: Json
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_id: string
          quantity?: number
          selected_sub_products?: Json
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_id?: string
          quantity?: number
          selected_sub_products?: Json
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      chefs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          specialties: string[] | null
          updated_at: string
          years_of_experience: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          specialties?: string[] | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          specialties?: string[] | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string
          billing_email: string | null
          created_at: string
          discount_percentage: number | null
          id: string
          logo_url: string | null
          name: string
          organization_number: string
          updated_at: string
        }
        Insert: {
          address: string
          billing_email?: string | null
          created_at?: string
          discount_percentage?: number | null
          id?: string
          logo_url?: string | null
          name: string
          organization_number?: string
          updated_at?: string
        }
        Update: {
          address?: string
          billing_email?: string | null
          created_at?: string
          discount_percentage?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          organization_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_addresses: {
        Row: {
          address: string
          company_id: string
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          address: string
          company_id: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: string
          company_id?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_invites: {
        Row: {
          company_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          inviter_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          inviter_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          inviter_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          discount_applies_to: string[] | null
          id: string
          is_active: boolean | null
          percentage: number
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          code: string
          created_at?: string
          discount_applies_to?: string[] | null
          id?: string
          is_active?: boolean | null
          percentage: number
          updated_at?: string
          valid_from?: string
          valid_until: string
        }
        Update: {
          code?: string
          created_at?: string
          discount_applies_to?: string[] | null
          id?: string
          is_active?: boolean | null
          percentage?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_types: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_item_event_types: {
        Row: {
          created_at: string
          event_type_id: string
          id: string
          menu_item_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type_id: string
          id?: string
          menu_item_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type_id?: string
          id?: string
          menu_item_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_event_types_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_event_types_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_serving_styles: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          serving_style_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          serving_style_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          serving_style_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_serving_styles_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_serving_styles_serving_style_id_fkey"
            columns: ["serving_style_id"]
            isOneToOne: false
            referencedRelation: "serving_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_sub_products: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          menu_item_id: string
          sub_product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          menu_item_id: string
          sub_product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          menu_item_id?: string
          sub_product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_sub_products_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_sub_products_sub_product_id_fkey"
            columns: ["sub_product_id"]
            isOneToOne: false
            referencedRelation: "sub_products"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          base_price: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_vegan: boolean | null
          minimum_quantity: number | null
          name: string
          updated_at: string
        }
        Insert: {
          base_price: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_vegan?: boolean | null
          minimum_quantity?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_vegan?: boolean | null
          minimum_quantity?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          menu_id: string
          order_id: string
          quantity: number
          selected_sub_products: Json
          total_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_id: string
          order_id: string
          quantity: number
          selected_sub_products?: Json
          total_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_id?: string
          order_id?: string
          quantity?: number
          selected_sub_products?: Json
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_fee_amount: number | null
          admin_fee_discount: number | null
          admin_fee_tax_amount: number | null
          allergy_notes: string | null
          created_at: string
          customer_email_sent: boolean | null
          delivery_fee_amount: number | null
          delivery_fee_discount: number | null
          delivery_fee_tax_amount: number | null
          delivery_notes: string | null
          discount_amount: number
          discount_code: string | null
          id: string
          invoice_generated: boolean | null
          invoice_url: string | null
          kitchen_email_sent: boolean | null
          product_tax_amount: number | null
          reference: string | null
          shipping_address: string
          shipping_email: string
          shipping_name: string
          shipping_phone: string
          status: string
          subtotal_pre_tax: number | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_fee_amount?: number | null
          admin_fee_discount?: number | null
          admin_fee_tax_amount?: number | null
          allergy_notes?: string | null
          created_at?: string
          customer_email_sent?: boolean | null
          delivery_fee_amount?: number | null
          delivery_fee_discount?: number | null
          delivery_fee_tax_amount?: number | null
          delivery_notes?: string | null
          discount_amount?: number
          discount_code?: string | null
          id?: string
          invoice_generated?: boolean | null
          invoice_url?: string | null
          kitchen_email_sent?: boolean | null
          product_tax_amount?: number | null
          reference?: string | null
          shipping_address: string
          shipping_email: string
          shipping_name: string
          shipping_phone: string
          status?: string
          subtotal_pre_tax?: number | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_fee_amount?: number | null
          admin_fee_discount?: number | null
          admin_fee_tax_amount?: number | null
          allergy_notes?: string | null
          created_at?: string
          customer_email_sent?: boolean | null
          delivery_fee_amount?: number | null
          delivery_fee_discount?: number | null
          delivery_fee_tax_amount?: number | null
          delivery_notes?: string | null
          discount_amount?: number
          discount_code?: string | null
          id?: string
          invoice_generated?: boolean | null
          invoice_url?: string | null
          kitchen_email_sent?: boolean | null
          product_tax_amount?: number | null
          reference?: string | null
          shipping_address?: string
          shipping_email?: string
          shipping_name?: string
          shipping_phone?: string
          status?: string
          subtotal_pre_tax?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_admin: boolean
          is_company_admin: boolean | null
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          is_admin?: boolean
          is_company_admin?: boolean | null
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_admin?: boolean
          is_company_admin?: boolean | null
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      serving_styles: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sub_products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_default: boolean | null
          is_vegan: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          is_vegan?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          is_vegan?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      get_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_company_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_no_company: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_owns_order: {
        Args: { _order_id: string; _user_id: string }
        Returns: boolean
      }
      users_in_same_company: {
        Args: { user_id_to_check: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "company_admin" | "user"
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
      app_role: ["admin", "company_admin", "user"],
    },
  },
} as const
