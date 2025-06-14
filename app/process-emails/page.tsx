"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Play, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { EmailConfigCard } from "@/components/email-config-card"

export default function ProcessEmailsPage() {
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const processEmails = async () => {
    setProcessing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/process-emails", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Error desconocido")
      }
    } catch (err) {
      setError("Error de conexión al procesar emails")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Procesamiento de Emails</h1>
        <p className="text-gray-600">
          Conecta con tu buzón de correo y procesa automáticamente los currículums recibidos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Control */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Procesamiento Automático
              </CardTitle>
              <CardDescription>Inicia el procesamiento de emails no leídos con adjuntos de currículums</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={processEmails} disabled={processing} className="w-full" size="lg">
                {processing ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Procesar Emails Nuevos
                  </>
                )}
              </Button>

              {result && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{result.message}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Configuración del Servidor */}
          <EmailConfigCard />
        </div>

        {/* Información del Proceso */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo Funciona?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Conexión al Email</h4>
                    <p className="text-sm text-gray-600">Se conecta a tu buzón usando IMAP y busca emails no leídos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Detección de Currículums</h4>
                    <p className="text-sm text-gray-600">Identifica adjuntos PDF/JPG que contengan currículums</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Análisis con IA</h4>
                    <p className="text-sm text-gray-600">
                      Gemini AI analiza y clasifica cada currículum automáticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Almacenamiento</h4>
                    <p className="text-sm text-gray-600">
                      Los datos estructurados se guardan en Supabase para búsqueda
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Archivo Soportados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline">PDF</Badge>
                <Badge variant="outline">DOC/DOCX</Badge>
                <Badge variant="outline">JPG/JPEG</Badge>
                <Badge variant="outline">PNG</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Extraída</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <p>• Departamento sugerido</p>
                <p>• Nivel educativo</p>
                <p>• Nivel jerárquico</p>
                <p>• Habilidades técnicas y blandas</p>
                <p>• Resumen ejecutivo</p>
                <p>• Puntuación de relevancia (1-100)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
