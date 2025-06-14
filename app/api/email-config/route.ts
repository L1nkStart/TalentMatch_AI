import { type NextRequest, NextResponse } from "next/server"
import { getActiveEmailConfig, saveEmailConfig, getAllEmailConfigs, ensureEmailConfigTable } from "@/lib/email-config"

export async function GET() {
  try {
    // Check if table exists first
    const tableExists = await ensureEmailConfigTable()
    if (!tableExists) {
      return NextResponse.json({
        configs: [],
        activeConfig: null,
        error: "Database not initialized. Please run the setup scripts.",
      })
    }

    const configs = await getAllEmailConfigs()
    const activeConfig = await getActiveEmailConfig()

    return NextResponse.json({
      configs: configs.map((config) => ({
        ...config,
        password: config.password ? "••••••••" : "",
      })),
      activeConfig: activeConfig
        ? {
            ...activeConfig,
            password: activeConfig.password ? "••••••••" : "",
          }
        : null,
    })
  } catch (error) {
    console.error("Error fetching email configs:", error)
    return NextResponse.json(
      {
        error: "Error al obtener configuraciones",
        configs: [],
        activeConfig: null,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if table exists first
    const tableExists = await ensureEmailConfigTable()
    if (!tableExists) {
      return NextResponse.json(
        {
          error: "Database not initialized. Please run the setup scripts first.",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { name, host, port, username, password, use_tls } = body

    // Validaciones básicas
    if (!host || !username || !password) {
      return NextResponse.json({ error: "Host, usuario y contraseña son requeridos" }, { status: 400 })
    }

    if (!port || port < 1 || port > 65535) {
      return NextResponse.json({ error: "Puerto debe ser un número entre 1 y 65535" }, { status: 400 })
    }

    const config = await saveEmailConfig({
      name: name || "Configuración Principal",
      host,
      port: Number.parseInt(port),
      username,
      password,
      use_tls: use_tls !== false,
      is_active: true,
    })

    // No enviar la contraseña en la respuesta
    const { password: _, ...safeConfig } = config

    return NextResponse.json({
      success: true,
      config: {
        ...safeConfig,
        password: "••••••••",
      },
    })
  } catch (error) {
    console.error("Error saving email config:", error)
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 })
  }
}
