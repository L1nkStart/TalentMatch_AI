import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID de configuración requerido" }, { status: 400 })
    }

    // Desactivar todas las configuraciones
    await supabase.from("email_configuration").update({ is_active: false }).neq("id", "")

    // Activar la configuración seleccionada
    const { data, error } = await supabase
      .from("email_configuration")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, config: data })
  } catch (error) {
    console.error("Error activating email config:", error)
    return NextResponse.json({ error: "Error al activar configuración" }, { status: 500 })
  }
}
