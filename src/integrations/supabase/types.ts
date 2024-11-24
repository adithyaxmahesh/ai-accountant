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
      ai_insights: {
        Row: {
          category: string
          confidence_score: number | null
          created_at: string
          id: string
          insight: string
          user_id: string | null
        }
        Insert: {
          category: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          insight: string
          user_id?: string | null
        }
        Update: {
          category?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          insight?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assurance_engagements: {
        Row: {
          client_name: string
          created_at: string | null
          end_date: string | null
          engagement_type: string
          findings: Json | null
          id: string
          recommendations: Json | null
          risk_assessment: Json | null
          start_date: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_name: string
          created_at?: string | null
          end_date?: string | null
          engagement_type: string
          findings?: Json | null
          id?: string
          recommendations?: Json | null
          risk_assessment?: Json | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_name?: string
          created_at?: string | null
          end_date?: string | null
          engagement_type?: string
          findings?: Json | null
          id?: string
          recommendations?: Json | null
          risk_assessment?: Json | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assurance_engagements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assurance_learning_materials: {
        Row: {
          category: string
          content: string
          created_at: string | null
          difficulty_level: string | null
          id: string
          title: string
          topic_area: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          title: string
          topic_area: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          title?: string
          topic_area?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      assurance_procedures: {
        Row: {
          created_at: string | null
          description: string
          engagement_id: string | null
          id: string
          performed_at: string | null
          performed_by: string | null
          procedure_type: string
          results: Json | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          engagement_id?: string | null
          id?: string
          performed_at?: string | null
          performed_by?: string | null
          procedure_type: string
          results?: Json | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          engagement_id?: string | null
          id?: string
          performed_at?: string | null
          performed_by?: string | null
          procedure_type?: string
          results?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assurance_procedures_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "assurance_engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assurance_procedures_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assurance_reports: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          description: string | null
          findings: Json | null
          id: string
          recommendations: Json | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          verification_date: string | null
          verified_by: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          findings?: Json | null
          id?: string
          recommendations?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          findings?: Json | null
          id?: string
          recommendations?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assurance_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_items: {
        Row: {
          amount: number | null
          audit_id: string | null
          category: string
          created_at: string
          description: string
          id: string
          status: string | null
        }
        Insert: {
          amount?: number | null
          audit_id?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          status?: string | null
        }
        Update: {
          amount?: number | null
          audit_id?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_items_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audit_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_reports: {
        Row: {
          created_at: string
          description: string | null
          document_id: string | null
          findings: Json | null
          id: string
          recommendations: string[] | null
          risk_level: string | null
          status: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_id?: string | null
          findings?: Json | null
          id?: string
          recommendations?: string[] | null
          risk_level?: string | null
          status?: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_id?: string | null
          findings?: Json | null
          id?: string
          recommendations?: string[] | null
          risk_level?: string | null
          status?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_reports_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "processed_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automatic_tax_calculations: {
        Row: {
          created_at: string
          estimated_tax: number
          id: string
          potential_savings: number
          recommendations: Json | null
          total_deductions: number
          total_income: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          estimated_tax?: number
          id?: string
          potential_savings?: number
          recommendations?: Json | null
          total_deductions?: number
          total_income?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          estimated_tax?: number
          id?: string
          potential_savings?: number
          recommendations?: Json | null
          total_deductions?: number
          total_income?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automatic_tax_calculations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          actions: Json | null
          conditions: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          rule_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rule_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rule_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      balance_sheet_items: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "balance_sheet_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_connections: {
        Row: {
          access_token: string
          account_id: string
          bank_name: string
          created_at: string
          id: string
          last_sync_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          account_id: string
          bank_name: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          account_id?: string
          bank_name?: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_information: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_name: string | null
          business_type: string | null
          city: string | null
          created_at: string
          ein: string | null
          fiscal_year_end: string | null
          id: string
          industry: string | null
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          ein?: string | null
          fiscal_year_end?: string | null
          id?: string
          industry?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          ein?: string | null
          fiscal_year_end?: string | null
          id?: string
          industry?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_information_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_insights: {
        Row: {
          category: string
          created_at: string
          id: string
          metrics: Json | null
          priority: string | null
          recommendations: string[] | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          metrics?: Json | null
          priority?: string | null
          recommendations?: string[] | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          metrics?: Json | null
          priority?: string | null
          recommendations?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flow_statements: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_statements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborator_access: {
        Row: {
          access_level: string
          collaborator_email: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          access_level: string
          collaborator_email: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          access_level?: string
          collaborator_email?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborator_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checks: {
        Row: {
          check_type: string | null
          created_at: string
          findings: Json | null
          id: string
          recommendations: string[] | null
          risk_level: string | null
          user_id: string | null
        }
        Insert: {
          check_type?: string | null
          created_at?: string
          findings?: Json | null
          id?: string
          recommendations?: string[] | null
          risk_level?: string | null
          user_id?: string | null
        }
        Update: {
          check_type?: string | null
          created_at?: string
          findings?: Json | null
          id?: string
          recommendations?: string[] | null
          risk_level?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          active: boolean | null
          amount_off: number | null
          code: string
          created_at: string
          currency: string | null
          description: string | null
          duration: string | null
          expires_at: string | null
          id: string
          max_redemptions: number | null
          percentage_off: number | null
          times_redeemed: number | null
        }
        Insert: {
          active?: boolean | null
          amount_off?: number | null
          code: string
          created_at?: string
          currency?: string | null
          description?: string | null
          duration?: string | null
          expires_at?: string | null
          id?: string
          max_redemptions?: number | null
          percentage_off?: number | null
          times_redeemed?: number | null
        }
        Update: {
          active?: boolean | null
          amount_off?: number | null
          code?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          duration?: string | null
          expires_at?: string | null
          id?: string
          max_redemptions?: number | null
          percentage_off?: number | null
          times_redeemed?: number | null
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      document_comments: {
        Row: {
          comment: string
          created_at: string
          document_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string
          document_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string
          document_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "processed_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_patterns: {
        Row: {
          category: string
          confidence: number | null
          created_at: string
          id: string
          is_expense: boolean | null
          pattern: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          confidence?: number | null
          created_at?: string
          id?: string
          is_expense?: boolean | null
          pattern: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          confidence?: number | null
          created_at?: string
          id?: string
          is_expense?: boolean | null
          pattern?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_patterns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_goals: {
        Row: {
          category: string
          created_at: string
          current_amount: number | null
          end_date: string
          id: string
          name: string
          start_date: string
          target_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          current_amount?: number | null
          end_date: string
          id?: string
          name: string
          start_date?: string
          target_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          current_amount?: number | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          target_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_health_metrics: {
        Row: {
          cash_flow_score: number | null
          created_at: string
          current_ratio: number | null
          debt_ratio: number | null
          health_score: number | null
          id: string
          metrics_data: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cash_flow_score?: number | null
          created_at?: string
          current_ratio?: number | null
          debt_ratio?: number | null
          health_score?: number | null
          id?: string
          metrics_data?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cash_flow_score?: number | null
          created_at?: string
          current_ratio?: number | null
          debt_ratio?: number | null
          health_score?: number | null
          id?: string
          metrics_data?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_health_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_planning: {
        Row: {
          created_at: string
          id: string
          plan_data: Json | null
          plan_type: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          plan_data?: Json | null
          plan_type: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          plan_data?: Json | null
          plan_type?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_planning_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forecasts: {
        Row: {
          confidence_level: number | null
          created_at: string
          factors: Json | null
          id: string
          period_end: string
          period_start: string
          predicted_revenue: number
          user_id: string | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          factors?: Json | null
          id?: string
          period_end: string
          period_start: string
          predicted_revenue: number
          user_id?: string | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          factors?: Json | null
          id?: string
          period_end?: string
          period_start?: string
          predicted_revenue?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forecasts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          created_at: string
          details: Json | null
          id: string
          risk_score: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          details?: Json | null
          id?: string
          risk_score?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          risk_score?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_tax_forms: {
        Row: {
          created_at: string
          form_data: Json
          id: string
          status: string | null
          template_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          form_data: Json
          id?: string
          status?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          form_data?: Json
          id?: string
          status?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_tax_forms_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "tax_form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_tax_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      income_statements: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "income_statements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_analytics: {
        Row: {
          created_at: string
          demand_forecast: Json | null
          id: string
          item_category: string | null
          optimization_suggestions: Json | null
          reorder_points: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          demand_forecast?: Json | null
          id?: string
          item_category?: string | null
          optimization_suggestions?: Json | null
          reorder_points?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          demand_forecast?: Json | null
          id?: string
          item_category?: string | null
          optimization_suggestions?: Json | null
          reorder_points?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      irs_publications: {
        Row: {
          content: string
          created_at: string
          effective_date: string
          expiration_date: string | null
          id: string
          publication_number: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          effective_date: string
          expiration_date?: string | null
          id?: string
          publication_number: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          effective_date?: string
          expiration_date?: string | null
          id?: string
          publication_number?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      owners_equity_statements: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owners_equity_statements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_documents: {
        Row: {
          confidence_score: number | null
          created_at: string
          document_type: string | null
          extracted_data: Json | null
          id: string
          original_filename: string
          processing_status: string | null
          storage_path: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          document_type?: string | null
          extracted_data?: Json | null
          id?: string
          original_filename: string
          processing_status?: string | null
          storage_path: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          document_type?: string | null
          extracted_data?: Json | null
          id?: string
          original_filename?: string
          processing_status?: string | null
          storage_path?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processed_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          role: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id: string
          role?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      receipt_analysis: {
        Row: {
          confidence_score: number | null
          created_at: string
          extracted_data: Json | null
          id: string
          location: string | null
          receipt_url: string | null
          suggested_tax_codes: Json | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json | null
          id?: string
          location?: string | null
          receipt_url?: string | null
          suggested_tax_codes?: Json | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          extracted_data?: Json | null
          id?: string
          location?: string | null
          receipt_url?: string | null
          suggested_tax_codes?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_records: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_logs: {
        Row: {
          created_at: string
          details: Json
          event_type: string
          id: string
          severity: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          severity: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          severity?: string
          timestamp?: string
        }
        Relationships: []
      }
      shopify_connections: {
        Row: {
          access_token: string
          created_at: string
          id: string
          last_sync_at: string | null
          shop_url: string
          user_id: string | null
          webhook_secret: string
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          shop_url: string
          user_id?: string | null
          webhook_secret: string
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          shop_url?: string
          user_id?: string | null
          webhook_secret?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_sync_logs: {
        Row: {
          connection_id: string | null
          created_at: string
          details: Json | null
          id: string
          status: string
          sync_type: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          status: string
          sync_type: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "shopify_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      state_operations: {
        Row: {
          compliance_status: string | null
          created_at: string
          id: string
          operation_type: string | null
          state: string | null
          tax_implications: Json | null
          user_id: string | null
        }
        Insert: {
          compliance_status?: string | null
          created_at?: string
          id?: string
          operation_type?: string | null
          state?: string | null
          tax_implications?: Json | null
          user_id?: string | null
        }
        Update: {
          compliance_status?: string | null
          created_at?: string
          id?: string
          operation_type?: string | null
          state?: string | null
          tax_implications?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "state_operations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      state_tax_brackets: {
        Row: {
          business_type: string
          created_at: string
          id: string
          max_income: number | null
          min_income: number
          rate: number
          state: string
        }
        Insert: {
          business_type: string
          created_at?: string
          id?: string
          max_income?: number | null
          min_income: number
          rate: number
          state: string
        }
        Update: {
          business_type?: string
          created_at?: string
          id?: string
          max_income?: number | null
          min_income?: number
          rate?: number
          state?: string
        }
        Relationships: []
      }
      state_tax_rates: {
        Row: {
          created_at: string
          id: string
          max_income: number | null
          min_income: number
          rate: number
          state: string
          tax_year: number
        }
        Insert: {
          created_at?: string
          id?: string
          max_income?: number | null
          min_income: number
          rate: number
          state: string
          tax_year: number
        }
        Update: {
          created_at?: string
          id?: string
          max_income?: number | null
          min_income?: number
          rate?: number
          state?: string
          tax_year?: number
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          interval: string | null
          name: string
          price_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          interval?: string | null
          name: string
          price_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          interval?: string | null
          name?: string
          price_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_analysis: {
        Row: {
          analysis_type: string
          created_at: string
          id: string
          jurisdiction: string | null
          recommendations: Json | null
          tax_impact: number | null
          user_id: string | null
        }
        Insert: {
          analysis_type: string
          created_at?: string
          id?: string
          jurisdiction?: string | null
          recommendations?: Json | null
          tax_impact?: number | null
          user_id?: string | null
        }
        Update: {
          analysis_type?: string
          created_at?: string
          id?: string
          jurisdiction?: string | null
          recommendations?: Json | null
          tax_impact?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_code_rules: {
        Row: {
          created_at: string
          id: string
          priority: number
          tax_code_id: string | null
          tax_rule_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          priority?: number
          tax_code_id?: string | null
          tax_rule_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          priority?: number
          tax_code_id?: string | null
          tax_rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_code_rules_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_code_rules_tax_rule_id_fkey"
            columns: ["tax_rule_id"]
            isOneToOne: false
            referencedRelation: "tax_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_codes: {
        Row: {
          category: string
          code: string
          created_at: string
          deduction_type: string
          description: string
          expense_category: string | null
          id: string
          state: string | null
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          deduction_type: string
          description: string
          expense_category?: string | null
          id?: string
          state?: string | null
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          deduction_type?: string
          description?: string
          expense_category?: string | null
          id?: string
          state?: string | null
        }
        Relationships: []
      }
      tax_deadlines: {
        Row: {
          created_at: string
          description: string | null
          due_date: string
          id: string
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_deadlines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_form_templates: {
        Row: {
          created_at: string
          form_type: string
          form_year: number
          id: string
          template_data: Json
        }
        Insert: {
          created_at?: string
          form_type: string
          form_year: number
          id?: string
          template_data: Json
        }
        Update: {
          created_at?: string
          form_type?: string
          form_year?: number
          id?: string
          template_data?: Json
        }
        Relationships: []
      }
      tax_planning_chats: {
        Row: {
          answer: string | null
          context: Json | null
          created_at: string
          id: string
          question: string | null
          user_id: string | null
        }
        Insert: {
          answer?: string | null
          context?: Json | null
          created_at?: string
          id?: string
          question?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: string | null
          context?: Json | null
          created_at?: string
          id?: string
          question?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_planning_chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_planning_scenarios: {
        Row: {
          created_at: string
          description: string | null
          estimated_tax_impact: number | null
          id: string
          name: string
          scenario_data: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_tax_impact?: number | null
          id?: string
          name: string
          scenario_data?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_tax_impact?: number | null
          id?: string
          name?: string
          scenario_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_planning_scenarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_rules: {
        Row: {
          calculation_formula: string | null
          created_at: string
          description: string
          effective_date: string
          expiration_date: string | null
          id: string
          publication_id: string | null
          rule_code: string
          updated_at: string
        }
        Insert: {
          calculation_formula?: string | null
          created_at?: string
          description: string
          effective_date: string
          expiration_date?: string | null
          id?: string
          publication_id?: string | null
          rule_code: string
          updated_at?: string
        }
        Update: {
          calculation_formula?: string | null
          created_at?: string
          description?: string
          effective_date?: string
          expiration_date?: string | null
          id?: string
          publication_id?: string | null
          rule_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_rules_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "irs_publications"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          notifications: boolean | null
          theme: string | null
        }
        Insert: {
          created_at?: string
          id: string
          notifications?: boolean | null
          theme?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notifications?: boolean | null
          theme?: string | null
        }
        Relationships: []
      }
      write_offs: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
          status: string | null
          tax_code_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description: string
          id?: string
          status?: string | null
          tax_code_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          status?: string | null
          tax_code_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "write_offs_tax_code_id_fkey"
            columns: ["tax_code_id"]
            isOneToOne: false
            referencedRelation: "tax_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "write_offs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      assurance_procedure_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "needs_review"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
