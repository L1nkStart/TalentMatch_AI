import { supabase } from "./supabase"

export type EmailConfig = {
  id: string
  name: string
  host: string
  port: number
  username: string
  password: string
  use_tls: boolean
  is_active: boolean
  last_tested?: string
  test_status?: string
  test_message?: string
  created_at: string
  updated_at: string
}

// Function to check if email_configuration table exists and create it if needed
export async function ensureEmailConfigTable() {
  try {
    // Try to query the table to see if it exists
    const { error } = await supabase.from("email_configuration").select("id").limit(1)

    if (error && error.message.includes("does not exist")) {
      // Table doesn't exist, we need to create it
      console.log("Email configuration table doesn't exist. Please run the SQL scripts.")
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking email config table:", error)
    return false
  }
}

export async function getActiveEmailConfig(): Promise<EmailConfig | null> {
  try {
    const tableExists = await ensureEmailConfigTable()
    if (!tableExists) {
      return null
    }

    const { data, error } = await supabase.from("email_configuration").select("*").eq("is_active", true).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null
      }
      console.error("Error fetching active email config:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getActiveEmailConfig:", error)
    return null
  }
}

export async function getAllEmailConfigs(): Promise<EmailConfig[]> {
  try {
    const tableExists = await ensureEmailConfigTable()
    if (!tableExists) {
      return []
    }

    const { data, error } = await supabase
      .from("email_configuration")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching email configs:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllEmailConfigs:", error)
    return []
  }
}

export async function saveEmailConfig(config: Omit<EmailConfig, "id" | "created_at" | "updated_at">) {
  try {
    const tableExists = await ensureEmailConfigTable()
    if (!tableExists) {
      throw new Error("Email configuration table doesn't exist. Please run the database setup scripts.")
    }

    // Desactivar configuraciones existentes si esta será activa
    if (config.is_active) {
      await supabase.from("email_configuration").update({ is_active: false }).eq("is_active", true)
    }

    // Insertar nueva configuración
    const { data, error } = await supabase
      .from("email_configuration")
      .insert({
        ...config,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error saving email config:", error)
    throw error
  }
}

export async function updateEmailConfigTest(id: string, status: string, message: string) {
  try {
    const tableExists = await ensureEmailConfigTable()
    if (!tableExists) {
      throw new Error("Email configuration table doesn't exist.")
    }

    const { error } = await supabase
      .from("email_configuration")
      .update({
        last_tested: new Date().toISOString(),
        test_status: status,
        test_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error updating email config test:", error)
    throw error
  }
}
