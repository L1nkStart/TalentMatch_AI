import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, host, port, username, password, use_tls } = body

    // Validaciones básicas
    if (!host || !username) {
      return NextResponse.json({ error: "Host y usuario son requeridos" }, { status: 400 })
    }

    if (!port || port < 1 || port > 65535) {
      return NextResponse.json({ error: "Puerto debe ser un número entre 1 y 65535" }, { status: 400 })
    }

    // Preparar datos para actualizar
    const updateData: any = {
      name: name || "Configuración Principal",
      host,
      port: Number.parseInt(port),
      username,
      use_tls: use_tls !== false,
      updated_at: new Date().toISOString(),
    }

    // Solo actualizar contraseña si se proporciona una nueva
    if (password && password !== "••••••••") {
      updateData.password = password
    }

    const { data, error } = await supabase
      .from("email_configuration")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // No enviar la contraseña en la respuesta
    const { password: _, ...safeConfig } = data

    return NextResponse.json({
      success: true,
      config: {
        ...safeConfig,
        password: "••••••••",
      },
    })
  } catch (error) {
    console.error("Error updating email config:", error)
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("email_configuration").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting email config:", error)
    return NextResponse.json({ error: "Error al eliminar configuración" }, { status: 500 })
  }
}
