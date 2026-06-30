// Supabase Database Types
// Run `bunx supabase gen types typescript` to generate full types
// For now, this is a placeholder

export type Database = {
  public: {
    Tables: Record<string, any>
    Views: Record<string, any>
    Functions: Record<string, any>
    Enums: Record<string, any>
  }
}
