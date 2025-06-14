import { NextResponse } from "next/server"
import { EmailProcessor } from "@/lib/email-processor"
import { getActiveEmailConfig, updateEmailConfigTest } from "@/lib/email-config"

export async function POST() {
  try {
    const config = await getActiveEmailConfig()

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay configuración de email activa",
          details: {
            error: "NO_CONFIG",
          },
        },
        { status: 400 },
      )
    }

    const processor = new EmailProcessor()
    await processor.initialize()

    const result = await processor.testConnection()

    // Actualizar el estado de la prueba en la base de datos
    await updateEmailConfigTest(config.id, result.success ? "success" : "error", result.message)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error testing email connection:", error)

    // Intentar actualizar el estado de error si tenemos configuración
    try {
      const config = await getActiveEmailConfig()
      if (config) {
        await updateEmailConfigTest(config.id, "error", error instanceof Error ? error.message : "Error desconocido")
      }
    } catch (updateError) {
      console.error("Error updating test status:", updateError)
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
        details: {
          error: "SYSTEM_ERROR",
          originalError: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    )
  }
}
