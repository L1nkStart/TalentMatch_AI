import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, Mail, BarChart3, Settings } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TalentMatch AI - Captación Inteligente de Talento",
  description: "Plataforma de IA para procesamiento automático de currículums y captación de talento",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">TM</span>
                    </div>
                    <span className="font-bold text-xl">TalentMatch AI</span>
                  </Link>

                  {/* Add the email configuration link to the navigation */}
                  <div className="flex items-center space-x-2">
                    <Link href="/">
                      <Button variant="ghost" size="sm">
                        <Home className="h-4 w-4 mr-2" />
                        Inicio
                      </Button>
                    </Link>
                    <Link href="/candidates">
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Candidatos
                      </Button>
                    </Link>
                    <Link href="/process-emails">
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Procesar
                      </Button>
                    </Link>
                    <Link href="/email-config">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configuración
                      </Button>
                    </Link>
                    <Link href="/analytics">
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Análisis
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
