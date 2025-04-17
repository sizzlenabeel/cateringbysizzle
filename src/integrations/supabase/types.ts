export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          address: string
          created_at: string
          discount_percentage: number | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          discount_percentage?: number | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          discount_percentage?: number | null
          id?: string
          logo_url?: string | null
          name?: string
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
          id?: string
          is_active?: boolean | null
          percentage?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string
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
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
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
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sub_products: {
        Row: {
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
