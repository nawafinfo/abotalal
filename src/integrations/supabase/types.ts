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
      ai_tools: {
        Row: {
          category: string
          color: string | null
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          logo_url: string | null
          name: string
          sort_order: number
          tool_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          name: string
          sort_order?: number
          tool_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          sort_order?: number
          tool_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      app_downloads: {
        Row: {
          app_id: string
          created_at: string
          id: string
          user_id: string | null
          version: string | null
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          user_id?: string | null
          version?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_downloads_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      app_reviews: {
        Row: {
          admin_reply: string | null
          admin_reply_at: string | null
          app_id: string
          comment: string | null
          created_at: string
          id: string
          is_visible: boolean
          rating: number
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          admin_reply?: string | null
          admin_reply_at?: string | null
          app_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          rating?: number
          updated_at?: string
          user_id: string
          user_name: string
        }
        Update: {
          admin_reply?: string | null
          admin_reply_at?: string | null
          app_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          rating?: number
          updated_at?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_reviews_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      app_screenshots: {
        Row: {
          app_id: string
          caption: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          app_id: string
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          app_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "app_screenshots_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      app_storage: {
        Row: {
          app_id: string
          created_at: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
        }
        Insert: {
          app_id: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
        }
        Update: {
          app_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_storage_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      app_updates: {
        Row: {
          app_id: string
          changelog: string | null
          created_at: string
          download_url: string | null
          id: string
          is_major: boolean
          released_at: string
          size: string | null
          version: string
        }
        Insert: {
          app_id: string
          changelog?: string | null
          created_at?: string
          download_url?: string | null
          id?: string
          is_major?: boolean
          released_at?: string
          size?: string | null
          version: string
        }
        Update: {
          app_id?: string
          changelog?: string | null
          created_at?: string
          download_url?: string | null
          id?: string
          is_major?: boolean
          released_at?: string
          size?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_updates_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      apps: {
        Row: {
          category: string
          color: string | null
          created_at: string
          description: string | null
          developer_name: string | null
          download_url: string | null
          downloads_count: string | null
          icon: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          last_update_at: string
          name: string
          package_name: string | null
          rating: number | null
          real_downloads: number
          requirements: string | null
          size: string | null
          sort_order: number
          support_email: string | null
          support_phone: string | null
          support_url: string | null
          updated_at: string
          version: string | null
          whats_new: string | null
        }
        Insert: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          developer_name?: string | null
          download_url?: string | null
          downloads_count?: string | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          last_update_at?: string
          name: string
          package_name?: string | null
          rating?: number | null
          real_downloads?: number
          requirements?: string | null
          size?: string | null
          sort_order?: number
          support_email?: string | null
          support_phone?: string | null
          support_url?: string | null
          updated_at?: string
          version?: string | null
          whats_new?: string | null
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          developer_name?: string | null
          download_url?: string | null
          downloads_count?: string | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          last_update_at?: string
          name?: string
          package_name?: string | null
          rating?: number | null
          real_downloads?: number
          requirements?: string | null
          size?: string | null
          sort_order?: number
          support_email?: string | null
          support_phone?: string | null
          support_url?: string | null
          updated_at?: string
          version?: string | null
          whats_new?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_visible: boolean
          post_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_visible?: boolean
          post_id: string
          user_id: string
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_visible?: boolean
          post_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          section_id: string | null
          sort_order: number
          summary: string | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          section_id?: string | null
          sort_order?: number
          summary?: string | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          section_id?: string | null
          sort_order?: number
          summary?: string | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "blog_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_sections: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          gradient_from: string | null
          gradient_to: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          gradient_from?: string | null
          gradient_to?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          gradient_from?: string | null
          gradient_to?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_sections_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          notes: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          service_id: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          likes_count: number
          logo_url: string | null
          name: string
          sort_order: number
          stream_url: string | null
          thumbnail_url: string | null
          updated_at: string
          views_count: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          likes_count?: number
          logo_url?: string | null
          name: string
          sort_order?: number
          stream_url?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          views_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          likes_count?: number
          logo_url?: string | null
          name?: string
          sort_order?: number
          stream_url?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          views_count?: number
        }
        Relationships: []
      }
      featured_clients: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          created_at: string
          description: string | null
          gradient: string
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gradient?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gradient?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          file_name: string | null
          id: string
          is_read: boolean
          media_type: string | null
          media_url: string | null
          receiver_id: string
          sender_id: string
          subject: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name?: string | null
          id?: string
          is_read?: boolean
          media_type?: string | null
          media_url?: string | null
          receiver_id: string
          sender_id: string
          subject: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string | null
          id?: string
          is_read?: boolean
          media_type?: string | null
          media_url?: string | null
          receiver_id?: string
          sender_id?: string
          subject?: string
        }
        Relationships: []
      }
      news_items: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          description: string | null
          id: string
          service_id: string | null
          status: string
          total_amount: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          description?: string | null
          id?: string
          service_id?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          description?: string | null
          id?: string
          service_id?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      package_subscriptions: {
        Row: {
          country_code: string
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          package_id: string | null
          package_name: string
          package_type: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          country_code?: string
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          package_id?: string | null
          package_name: string
          package_type: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          country_code?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          package_id?: string | null
          package_name?: string
          package_type?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string
          description: string | null
          discount_percent: number | null
          features: string[] | null
          id: string
          is_active: boolean
          name: string
          price: number
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          name: string
          price?: number
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      points_history: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          item_id: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          item_id: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          item_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "portfolio_items"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          category: string
          client_name: string | null
          created_at: string
          description: string | null
          details: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          project_date: string | null
          project_url: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          client_name?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          project_date?: string | null
          project_url?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          client_name?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          project_date?: string | null
          project_url?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          points_awarded: number
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_awarded?: number
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          points_awarded?: number
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          id: string
          points: number
          total_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          points?: number
          total_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          points?: number
          total_earned?: number
          updated_at?: string
          user_id?: string
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
      wifi_orders: {
        Row: {
          admin_notes: string | null
          country: string | null
          country_code: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          details: string | null
          id: string
          order_type: string
          price: number | null
          product_id: string | null
          product_name: string
          section: string
          status: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          details?: string | null
          id?: string
          order_type?: string
          price?: number | null
          product_id?: string | null
          product_name: string
          section: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          details?: string | null
          id?: string
          order_type?: string
          price?: number | null
          product_id?: string | null
          product_name?: string
          section?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wifi_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "wifi_products"
            referencedColumns: ["id"]
          },
        ]
      }
      wifi_posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          sort_order: number | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wifi_product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wifi_product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "wifi_products"
            referencedColumns: ["id"]
          },
        ]
      }
      wifi_product_updates: {
        Row: {
          changelog: string | null
          created_at: string
          download_url: string | null
          id: string
          is_major: boolean
          product_id: string
          released_at: string
          size: string | null
          version: string
        }
        Insert: {
          changelog?: string | null
          created_at?: string
          download_url?: string | null
          id?: string
          is_major?: boolean
          product_id: string
          released_at?: string
          size?: string | null
          version: string
        }
        Update: {
          changelog?: string | null
          created_at?: string
          download_url?: string | null
          id?: string
          is_major?: boolean
          product_id?: string
          released_at?: string
          size?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "wifi_product_updates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "wifi_products"
            referencedColumns: ["id"]
          },
        ]
      }
      wifi_product_videos: {
        Row: {
          created_at: string
          id: string
          product_id: string
          sort_order: number
          title: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          title: string
          youtube_url: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          title?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "wifi_product_videos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "wifi_products"
            referencedColumns: ["id"]
          },
        ]
      }
      wifi_products: {
        Row: {
          category: string
          code_content: string | null
          created_at: string
          description: string | null
          developer_name: string | null
          discount_percent: number | null
          download_url: string | null
          guide_content: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_free: boolean | null
          last_update_at: string
          logo_url: string | null
          name: string
          os: string | null
          preview_url: string | null
          price: number | null
          size: string | null
          sort_order: number | null
          support_email: string | null
          support_phone: string | null
          support_url: string | null
          type: string | null
          updated_at: string
          version: string | null
          website_url: string | null
        }
        Insert: {
          category?: string
          code_content?: string | null
          created_at?: string
          description?: string | null
          developer_name?: string | null
          discount_percent?: number | null
          download_url?: string | null
          guide_content?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_free?: boolean | null
          last_update_at?: string
          logo_url?: string | null
          name: string
          os?: string | null
          preview_url?: string | null
          price?: number | null
          size?: string | null
          sort_order?: number | null
          support_email?: string | null
          support_phone?: string | null
          support_url?: string | null
          type?: string | null
          updated_at?: string
          version?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string
          code_content?: string | null
          created_at?: string
          description?: string | null
          developer_name?: string | null
          discount_percent?: number | null
          download_url?: string | null
          guide_content?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_free?: boolean | null
          last_update_at?: string
          logo_url?: string | null
          name?: string
          os?: string | null
          preview_url?: string | null
          price?: number | null
          size?: string | null
          sort_order?: number | null
          support_email?: string | null
          support_phone?: string | null
          support_url?: string | null
          type?: string | null
          updated_at?: string
          version?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      my_referrals: {
        Row: {
          created_at: string | null
          id: string | null
          points_awarded: number | null
          referred_email_masked: string | null
          referred_user_id: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          points_awarded?: number | null
          referred_email_masked?: never
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          points_awarded?: number | null
          referred_email_masked?: never
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
