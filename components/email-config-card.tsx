"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Loader2 } from "lucide-react"
import Link from "next/link"

type EmailConfig = {
  name: string
  host: string
  port: number
  username: string
  test_status?: string
}

export function EmailConfigCard() {
  const [config, setConfig] = useState<EmailConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/email-config")
      const data = await response.json()
      setConfig(data.config)
    } catch (error) {
      console.error("Error fetching config:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Configuración del Servidor
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Configuración del Servidor
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-600 mb-4">No hay configuración de email</p>
          <Link href="/email-config">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Configurar Servidor
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = () => {
    if (config.test_status === "success") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-700">
          Conectado
        </Badge>
      )
    }
    if (config.test_status === "error") {
      return <Badge variant="destructive">Error</Badge>
    }
    return <Badge variant="secondary">Sin probar</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Configuración del Servidor
          </div>
          <Link href="/email-config">
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Usuario:</span>
            <p className="text-gray-600">{config.username}</p>
          </div>
          <div>
            <span className="font-medium">Servidor:</span>
            <p className="text-gray-600">{config.host}</p>
          </div>
          <div>
            <span className="font-medium">Puerto:</span>
            <p className="text-gray-600">{config.port}</p>
          </div>
          <div>
            <span className="font-medium">Estado:</span>
            {getStatusBadge()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
