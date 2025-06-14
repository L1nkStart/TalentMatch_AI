"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  TestTube,
  Save,
  Plus,
  Edit,
  Trash2,
  Power,
  Copy,
  Database,
  Info,
  Wifi,
  WifiOff,
} from "lucide-react"

type EmailConfig = {
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

type TestResult = {
  success: boolean
  message: string
  details?: any
}

export default function EmailConfigPage() {
  const [configs, setConfigs] = useState<EmailConfig[]>([])
  const [activeConfig, setActiveConfig] = useState<EmailConfig | null>(null)
  const [editingConfig, setEditingConfig] = useState<EmailConfig | null>(null)
  const [isNewConfig, setIsNewConfig] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  const defaultConfig: Omit<EmailConfig, "id" | "created_at" | "updated_at"> = {
    name: "Nueva Configuración",
    host: "mail.laguerramendez.com",
    port: 993,
    username: "Usuario@laguerramendez.com",
    password: "",
    use_tls: true,
    is_active: false,
  }

  const commonPorts = [
    { port: 993, protocol: "IMAP SSL/TLS", description: "Puerto estándar para IMAP con SSL" },
    { port: 143, protocol: "IMAP", description: "Puerto estándar para IMAP sin SSL" },
    { port: 995, protocol: "POP3 SSL/TLS", description: "Puerto estándar para POP3 con SSL" },
    { port: 110, protocol: "POP3", description: "Puerto estándar para POP3 sin SSL" },
  ]

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/email-config")
      const data = await response.json()

      if (data.error) {
        setDbError(data.error)
      } else {
        setConfigs(data.configs || [])
        setActiveConfig(data.activeConfig)
        setDbError(null)
      }
    } catch (error) {
      console.error("Error fetching configs:", error)
      setMessage({ type: "error", text: "Error al cargar las configuraciones" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingConfig) return

    setSaving(true)
    setMessage(null)

    try {
      let response
      if (isNewConfig) {
        response = await fetch("/api/email-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingConfig),
        })
      } else {
        response = await fetch(`/api/email-config/${editingConfig.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingConfig),
        })
      }

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Configuración guardada exitosamente" })
        setDialogOpen(false)
        setEditingConfig(null)
        await fetchConfigs()
      } else {
        setMessage({ type: "error", text: data.error || "Error al guardar configuración" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión al guardar" })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async (configId: string) => {
    setTesting(true)
    setMessage(null)
    setTestResult(null)

    try {
      // Primero activar temporalmente la configuración para probarla
      await fetch("/api/email-config/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: configId }),
      })

      const response = await fetch("/api/email-config/test", {
        method: "POST",
      })

      const data = await response.json()
      setTestResult(data)

      if (data.success) {
        setMessage({ type: "success", text: data.message })
      } else {
        setMessage({ type: "error", text: data.message || "Error en la prueba de conexión" })
      }

      await fetchConfigs()
    } catch (error) {
      setMessage({ type: "error", text: "Error al probar la conexión" })
      setTestResult({
        success: false,
        message: "Error de red al probar la conexión",
      })
    } finally {
      setTesting(false)
    }
  }

  const handleActivate = async (configId: string) => {
    try {
      const response = await fetch("/api/email-config/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: configId }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Configuración activada exitosamente" })
        await fetchConfigs()
      } else {
        setMessage({ type: "error", text: "Error al activar configuración" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al activar configuración" })
    }
  }

  const handleDelete = async (configId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta configuración?")) {
      return
    }

    try {
      const response = await fetch(`/api/email-config/${configId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Configuración eliminada exitosamente" })
        await fetchConfigs()
      } else {
        setMessage({ type: "error", text: "Error al eliminar configuración" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar configuración" })
    }
  }

  const handleDuplicate = (config: EmailConfig) => {
    setEditingConfig({
      ...config,
      id: "",
      name: `${config.name} (Copia)`,
      is_active: false,
      created_at: "",
      updated_at: "",
    })
    setIsNewConfig(true)
    setDialogOpen(true)
  }

  const openNewConfigDialog = () => {
    setEditingConfig({ ...defaultConfig } as EmailConfig)
    setIsNewConfig(true)
    setDialogOpen(true)
  }

  const openEditConfigDialog = (config: EmailConfig) => {
    setEditingConfig({ ...config })
    setIsNewConfig(false)
    setDialogOpen(true)
  }

  const getStatusBadge = (config: EmailConfig) => {
    if (config.test_status === "success") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <Wifi className="h-3 w-3 mr-1" />
          Conectado
        </Badge>
      )
    }
    if (config.test_status === "error") {
      return (
        <Badge variant="destructive">
          <WifiOff className="h-3 w-3 mr-1" />
          Error
        </Badge>
      )
    }
    return <Badge variant="secondary">Sin probar</Badge>
  }

  const getErrorSuggestions = (details: any) => {
    if (!details) return []

    const suggestions = []

    switch (details.error) {
      case "DNS_ERROR":
        suggestions.push("Verifique que el nombre del servidor sea correcto")
        suggestions.push("Intente usar la IP del servidor en lugar del nombre")
        suggestions.push("Verifique su conexión a internet")
        break
      case "CONNECTION_REFUSED":
        suggestions.push("Verifique que el puerto sea correcto")
        suggestions.push("Intente con puerto 143 (IMAP sin SSL) o 993 (IMAP con SSL)")
        suggestions.push("Contacte a su proveedor de email para confirmar el puerto")
        break
      case "CONNECTION_TIMEOUT":
        suggestions.push("El servidor puede estar sobrecargado, intente más tarde")
        suggestions.push("Verifique su firewall o proxy")
        suggestions.push("Intente con un timeout mayor")
        break
      case "AUTH_ERROR":
        suggestions.push("Verifique que el usuario y contraseña sean correctos")
        suggestions.push("Algunos servidores requieren contraseñas de aplicación")
        suggestions.push("Verifique si necesita habilitar IMAP en su cuenta")
        break
      case "SSL_ERROR":
        suggestions.push("Intente desactivar TLS/SSL temporalmente")
        suggestions.push("Verifique que el servidor soporte SSL en ese puerto")
        suggestions.push("El certificado del servidor puede estar vencido")
        break
      default:
        suggestions.push("Verifique todos los parámetros de configuración")
        suggestions.push("Contacte a su proveedor de email para obtener ayuda")
    }

    return suggestions
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuraciones de Email</h1>
          <p className="text-gray-600">Error de configuración de base de datos</p>
        </div>

        <Card className="border-2 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-red-600" />
              Error de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{dbError}</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Para resolver este problema, necesitas ejecutar los scripts de configuración de la base de datos:
              </p>

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-mono space-y-1">
                  <div>
                    1. Ejecuta: <strong>scripts/01-create-tables.sql</strong>
                  </div>
                  <div>
                    2. Ejecuta: <strong>scripts/03-insert-default-email-config.sql</strong>
                  </div>
                </p>
              </div>

              <Button onClick={fetchConfigs} className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Reintentar Conexión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuraciones de Email</h1>
            <p className="text-gray-600">Gestiona múltiples configuraciones de servidor de correo</p>
          </div>
          <Button onClick={openNewConfigDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Configuración
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6">
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Resultado de Prueba Detallado */}
      {testResult && !testResult.success && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Diagnóstico de Conexión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="error" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="error">Error</TabsTrigger>
                <TabsTrigger value="suggestions">Soluciones</TabsTrigger>
              </TabsList>
              <TabsContent value="error" className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Mensaje de Error:</h4>
                  <p className="text-sm text-gray-700">{testResult.message}</p>
                </div>
                {testResult.details && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Detalles Técnicos:</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Servidor:</strong> {testResult.details.host}:{testResult.details.port}
                      </p>
                      <p>
                        <strong>TLS:</strong> {testResult.details.tls ? "Habilitado" : "Deshabilitado"}
                      </p>
                      <p>
                        <strong>Tipo de Error:</strong> {testResult.details.error}
                      </p>
                      {testResult.details.originalError && (
                        <p>
                          <strong>Error Original:</strong> {testResult.details.originalError}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="suggestions" className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Posibles Soluciones:</h4>
                  <ul className="space-y-2">
                    {getErrorSuggestions(testResult.details).map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Lista de Configuraciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {configs.map((config) => (
          <Card key={config.id} className={`relative ${config.is_active ? "ring-2 ring-blue-500" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {config.name}
                </CardTitle>
                {config.is_active && <Badge className="bg-blue-100 text-blue-800">Activa</Badge>}
              </div>
              <CardDescription>{config.username}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium">Servidor:</span> {config.host}:{config.port}
                </div>
                <div>
                  <span className="font-medium">TLS:</span> {config.use_tls ? "Sí" : "No"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Estado:</span>
                  {getStatusBadge(config)}
                </div>
                {config.last_tested && (
                  <div>
                    <span className="font-medium">Última prueba:</span>
                    <br />
                    <span className="text-gray-600 text-xs">{new Date(config.last_tested).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {!config.is_active && (
                  <Button size="sm" onClick={() => handleActivate(config.id)} variant="outline">
                    <Power className="h-3 w-3 mr-1" />
                    Activar
                  </Button>
                )}

                <Button size="sm" onClick={() => handleTest(config.id)} disabled={testing} variant="outline">
                  {testing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <TestTube className="h-3 w-3 mr-1" />}
                  Probar
                </Button>

                <Button size="sm" onClick={() => openEditConfigDialog(config)} variant="outline">
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>

                <Button size="sm" onClick={() => handleDuplicate(config)} variant="outline">
                  <Copy className="h-3 w-3 mr-1" />
                  Duplicar
                </Button>

                {!config.is_active && (
                  <Button size="sm" onClick={() => handleDelete(config.id)} variant="destructive">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Eliminar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {configs.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay configuraciones</h3>
              <p className="text-gray-600 mb-4">Crea tu primera configuración de email para comenzar</p>
              <Button onClick={openNewConfigDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Configuración
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Información de Puertos Comunes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Puertos y Protocolos Comunes
          </CardTitle>
          <CardDescription>Configuraciones típicas para servidores de correo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonPorts.map((portInfo, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{portInfo.protocol}</span>
                  <Badge variant="outline">Puerto {portInfo.port}</Badge>
                </div>
                <p className="text-sm text-gray-600">{portInfo.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para Editar/Crear Configuración */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isNewConfig ? "Nueva Configuración" : "Editar Configuración"}</DialogTitle>
            <DialogDescription>
              {isNewConfig
                ? "Crea una nueva configuración de servidor de correo"
                : "Modifica la configuración existente"}
            </DialogDescription>
          </DialogHeader>

          {editingConfig && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={editingConfig.name}
                  onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                  placeholder="Mi Configuración"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Servidor</Label>
                  <Input
                    id="host"
                    value={editingConfig.host}
                    onChange={(e) => setEditingConfig({ ...editingConfig, host: e.target.value })}
                    placeholder="mail.ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="port">Puerto</Label>
                  <Input
                    id="port"
                    type="number"
                    value={editingConfig.port}
                    onChange={(e) =>
                      setEditingConfig({ ...editingConfig, port: Number.parseInt(e.target.value) || 993 })
                    }
                    placeholder="993"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="email"
                  value={editingConfig.username}
                  onChange={(e) => setEditingConfig({ ...editingConfig, username: e.target.value })}
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={editingConfig.password}
                    onChange={(e) => setEditingConfig({ ...editingConfig, password: e.target.value })}
                    placeholder={isNewConfig ? "Contraseña" : "Dejar vacío para mantener actual"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="use_tls"
                  checked={editingConfig.use_tls}
                  onCheckedChange={(checked) => setEditingConfig({ ...editingConfig, use_tls: checked })}
                />
                <Label htmlFor="use_tls">Usar TLS/SSL</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isNewConfig ? "Crear" : "Actualizar"}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
