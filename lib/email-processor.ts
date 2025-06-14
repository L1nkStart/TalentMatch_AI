import Imap from "imap"
import { simpleParser } from "mailparser"
import { supabase } from "./supabase"
import { analyzeResume } from "./gemini"
import { getActiveEmailConfig, type EmailConfig } from "./email-config"
import * as path from "path"

export class EmailProcessor {
  private config: EmailConfig | null = null

  async initialize() {
    this.config = await getActiveEmailConfig()
    if (!this.config) {
      throw new Error("No hay configuración de email activa. Configure el servidor de correo primero.")
    }
  }

  private createImapConnection(): Imap {
    if (!this.config) {
      throw new Error("Email configuration not initialized")
    }

    const imapConfig: any = {
      user: this.config.username,
      password: this.config.password,
      host: this.config.host,
      port: this.config.port,
      tls: this.config.use_tls,
      tlsOptions: {
        rejectUnauthorized: false,
        servername: this.config.host,
      },
      connTimeout: 60000, // 60 seconds
      authTimeout: 30000, // 30 seconds
      keepalive: false,
    }

    console.log(
      `Attempting IMAP connection to ${this.config.host}:${this.config.port} with TLS: ${this.config.use_tls}`,
    )

    return new Imap(imapConfig)
  }

  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    if (!this.config) {
      await this.initialize()
    }

    return new Promise((resolve) => {
      const imap = this.createImapConnection()
      let connectionAttempted = false

      const timeout = setTimeout(() => {
        if (!connectionAttempted) {
          imap.destroy()
          resolve({
            success: false,
            message: `Timeout: No se pudo conectar al servidor ${this.config?.host}:${this.config?.port} en 30 segundos`,
            details: {
              host: this.config?.host,
              port: this.config?.port,
              tls: this.config?.use_tls,
              error: "CONNECTION_TIMEOUT",
            },
          })
        }
      }, 30000)

      imap.once("ready", () => {
        connectionAttempted = true
        clearTimeout(timeout)

        // Try to open INBOX to verify full functionality
        imap.openBox("INBOX", true, (err, box) => {
          imap.end()

          if (err) {
            resolve({
              success: false,
              message: `Conexión establecida pero no se pudo acceder a INBOX: ${err.message}`,
              details: {
                host: this.config?.host,
                port: this.config?.port,
                error: "INBOX_ACCESS_ERROR",
                originalError: err.message,
              },
            })
          } else {
            resolve({
              success: true,
              message: `Conexión exitosa al servidor ${this.config?.host}:${this.config?.port}. INBOX accesible con ${box?.messages?.total || 0} mensajes.`,
              details: {
                host: this.config?.host,
                port: this.config?.port,
                tls: this.config?.use_tls,
                messages: box?.messages?.total || 0,
              },
            })
          }
        })
      })

      imap.once("error", (err) => {
        connectionAttempted = true
        clearTimeout(timeout)

        let errorMessage = `Error de conexión: ${err.message}`
        let errorType = "UNKNOWN_ERROR"

        // Categorize common errors
        if (err.message.includes("ENOTFOUND")) {
          errorMessage = `No se pudo resolver el nombre del servidor: ${this.config?.host}`
          errorType = "DNS_ERROR"
        } else if (err.message.includes("ECONNREFUSED")) {
          errorMessage = `Conexión rechazada por el servidor ${this.config?.host}:${this.config?.port}. Verifique el puerto.`
          errorType = "CONNECTION_REFUSED"
        } else if (err.message.includes("ETIMEDOUT")) {
          errorMessage = `Timeout de conexión al servidor ${this.config?.host}:${this.config?.port}`
          errorType = "CONNECTION_TIMEOUT"
        } else if (err.message.includes("authentication")) {
          errorMessage = `Error de autenticación. Verifique usuario y contraseña.`
          errorType = "AUTH_ERROR"
        } else if (err.message.includes("certificate")) {
          errorMessage = `Error de certificado SSL/TLS. Intente desactivar TLS o verifique el certificado.`
          errorType = "SSL_ERROR"
        }

        resolve({
          success: false,
          message: errorMessage,
          details: {
            host: this.config?.host,
            port: this.config?.port,
            tls: this.config?.use_tls,
            error: errorType,
            originalError: err.message,
          },
        })
      })

      try {
        imap.connect()
      } catch (error) {
        connectionAttempted = true
        clearTimeout(timeout)
        resolve({
          success: false,
          message: `Error al iniciar conexión: ${error instanceof Error ? error.message : "Error desconocido"}`,
          details: {
            host: this.config?.host,
            port: this.config?.port,
            error: "INIT_ERROR",
            originalError: error instanceof Error ? error.message : "Unknown error",
          },
        })
      }
    })
  }

  // Rest of the methods remain the same...
  async processEmails() {
    if (!this.config) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const imap = this.createImapConnection()

      imap.once("ready", () => {
        imap.openBox("INBOX", false, (err, box) => {
          if (err) {
            reject(err)
            return
          }

          // Buscar emails no leídos con adjuntos
          imap.search(["UNSEEN"], (err, results) => {
            if (err) {
              reject(err)
              return
            }

            if (results.length === 0) {
              resolve([])
              return
            }

            const fetch = imap.fetch(results, { bodies: "" })
            const processedEmails: any[] = []

            fetch.on("message", (msg, seqno) => {
              msg.on("body", (stream, info) => {
                simpleParser(stream, async (err, parsed) => {
                  if (err) {
                    console.error("Error parsing email:", err)
                    return
                  }

                  try {
                    await this.processEmailWithAttachments(parsed)
                    processedEmails.push(parsed)
                  } catch (error) {
                    console.error("Error processing email:", error)
                  }
                })
              })
            })

            fetch.once("end", () => {
              resolve(processedEmails)
            })
          })
        })
      })

      imap.once("error", (err) => {
        reject(err)
      })

      imap.connect()
    })
  }

  private async processEmailWithAttachments(email: any) {
    if (!email.attachments || email.attachments.length === 0) {
      return
    }

    for (const attachment of email.attachments) {
      if (this.isResumeFile(attachment.filename)) {
        try {
          // Log del procesamiento
          const { data: logEntry } = await supabase
            .from("email_processing_log")
            .insert({
              email_subject: email.subject,
              sender_email: email.from?.value[0]?.address,
              attachment_name: attachment.filename,
              processing_status: "processing",
            })
            .select()
            .single()

          // Extraer texto del currículum (simplificado para el ejemplo)
          const resumeText = await this.extractTextFromAttachment(attachment)

          // Analizar con Gemini
          const analysis = await analyzeResume(resumeText)

          // Guardar candidato en Supabase
          const { data: candidate } = await supabase
            .from("candidates")
            .insert({
              email: email.from?.value[0]?.address,
              full_name: this.extractNameFromEmail(email.from?.value[0]?.name || email.from?.value[0]?.address),
              department: analysis.department,
              education_level: analysis.education_level,
              hierarchical_level: analysis.hierarchical_level,
              skills: analysis.skills,
              executive_summary: analysis.executive_summary,
              relevance_score: analysis.relevance_score,
              resume_url: `/resumes/${attachment.filename}`,
            })
            .select()
            .single()

          // Actualizar log
          await supabase
            .from("email_processing_log")
            .update({
              processing_status: "completed",
              candidate_id: candidate.id,
            })
            .eq("id", logEntry.id)
        } catch (error) {
          console.error("Error processing attachment:", error)

          // Actualizar log con error
          await supabase.from("email_processing_log").update({
            processing_status: "error",
            error_message: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }
    }
  }

  private isResumeFile(filename: string): boolean {
    const resumeExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
    const resumeKeywords = ["cv", "curriculum", "resume", "hoja de vida"]

    const extension = path.extname(filename.toLowerCase())
    const nameContainsKeyword = resumeKeywords.some((keyword) => filename.toLowerCase().includes(keyword))

    return resumeExtensions.includes(extension) || nameContainsKeyword
  }

  private async extractTextFromAttachment(attachment: any): Promise<string> {
    // Implementación simplificada - en producción usarías librerías como pdf-parse, mammoth, etc.
    return `Texto extraído del currículum: ${attachment.filename}
    
    Experiencia profesional:
    - Desarrollador Full Stack con 5 años de experiencia
    - Especializado en React, Node.js y TypeScript
    - Experiencia en AWS y arquitectura de microservicios
    
    Educación:
    - Ingeniería en Sistemas Computacionales
    - Certificaciones en AWS y React
    
    Habilidades:
    JavaScript, TypeScript, React, Node.js, AWS, Docker, MongoDB, PostgreSQL`
  }

  private extractNameFromEmail(nameOrEmail: string): string {
    if (nameOrEmail.includes("@")) {
      return nameOrEmail.split("@")[0].replace(/[._]/g, " ")
    }
    return nameOrEmail
  }
}
