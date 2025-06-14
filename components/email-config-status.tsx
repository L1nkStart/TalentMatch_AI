"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, AlertCircle, CheckCircle, Database } from "lucide-react"
import Link from "next/link"

type EmailConfig = {
  id?: string
  name: string
  host: string
  port: number
  username: string
  test_status?: string
  test_message?: string
  last_tested?: string
}

export function EmailConfigStatus() {
  const [config, setConfig] = useState<EmailConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/email-config")
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setConfig(data.activeConfig)
      }
    } catch (error) {
      console.error("Error fetching config:", error)
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = () => {
    if (!config) {
      return {
        status: "No configurado",
        color: "text-red-600",
        icon: AlertCircle,
        bgColor: "bg-red-50 border-red-200",
      }
    }

    if (config.test_status === "success") {
      return {
        status: "Conectado",
        color: "text-green-600",
        icon: CheckCircle,
        bgColor: "bg-green-50 border-green-200",
      }
    }

    if (config.test_status === "error") {
      return {
        status: "Error de conexión",
        color: "text-red-600",
        icon: AlertCircle,
        bgColor: "bg-red-50 border-red-200",
      }
    }

    return {
      status: "Sin probar",
      color: "text-yellow-600",
      icon: AlertCircle,
      bgColor: "bg-yellow-50 border-yellow-200",
    }
  }

  if (loading) {
    return (
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Configuración del Servidor de Correo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mt-12 border-2 bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-red-600" />
            Error de Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Para resolver este problema, necesitas ejecutar los scripts de configuración de la base de datos:
            </p>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-mono">
                1. Ejecuta el script: <strong>scripts/01-create-tables.sql</strong>
                <br />
                2. Ejecuta el script: <strong>scripts/03-insert-default-email-config.sql</strong>
              </p>
            </div>

            <Link href="/email-config">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Ir a Configuración
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <Card className={`mt-12 border-2 ${statusInfo.bgColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Configuración del Servidor de Correo</span>
          <Link href="/email-config">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </CardTitle>
        <CardDescription>
          {config
            ? "Configuración actual para el procesamiento automático de emails"
            : "Configure su servidor de correo para comenzar a procesar currículums"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {config ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Usuario:</strong> {config.username}
            </div>
            <div>
              <strong>Servidor:</strong> {config.host}
            </div>
            <div>
              <strong>Puerto:</strong> {config.port}
            </div>
            <div className="flex items-center gap-2">
              <strong>Estado:</strong>
              <div className="flex items-center gap-1">
                <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                <span className={`font-medium ${statusInfo.color}`}>{statusInfo.status}</span>
              </div>
            </div>
            {config.last_tested && (
              <div className="md:col-span-2">
                <strong>Última prueba:</strong> {new Date(config.last_tested).toLocaleString()}
              </div>
            )}
            {config.test_message && (
              <div className="md:col-span-2">
                <strong>Mensaje:</strong> {config.test_message}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              No hay configuración de email. Configure su servidor de correo para comenzar.
            </p>
            <Link href="/email-config">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Configurar Ahora
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
