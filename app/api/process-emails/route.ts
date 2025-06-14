import { NextResponse } from "next/server"
import { EmailProcessor } from "@/lib/email-processor"

export async function POST() {
  try {
    const processor = new EmailProcessor()

    // Initialize with dynamic configuration
    await processor.initialize()

    const results = await processor.processEmails()

    return NextResponse.json({
      success: true,
      processed: results.length,
      message: `Se procesaron ${results.length} emails exitosamente`,
    })
  } catch (error) {
    console.error("Error processing emails:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
