"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Award } from "lucide-react"

export default function AnalyticsPage() {
  // Datos simulados para el dashboard
  const departmentStats = [
    { name: "Desarrollo de Software", count: 45, percentage: 36 },
    { name: "Marketing Digital", count: 28, percentage: 23 },
    { name: "Recursos Humanos", count: 18, percentage: 15 },
    { name: "Finanzas", count: 15, percentage: 12 },
    { name: "Ventas", count: 12, percentage: 10 },
    { name: "Diseño", count: 5, percentage: 4 },
  ]

  const educationStats = [
    { name: "Ingeniería", count: 52, percentage: 42 },
    { name: "Licenciatura", count: 38, percentage: 31 },
    { name: "Máster", count: 21, percentage: 17 },
    { name: "Técnico", count: 8, percentage: 6 },
    { name: "Doctorado", count: 4, percentage: 3 },
  ]

  const hierarchicalStats = [
    { name: "Senior", count: 48, percentage: 39 },
    { name: "Semi-Senior", count: 35, percentage: 28 },
    { name: "Junior", count: 28, percentage: 23 },
    { name: "Lead", count: 8, percentage: 7 },
    { name: "Manager", count: 4, percentage: 3 },
  ]

  const topSkills = [
    "JavaScript",
    "React",
    "Python",
    "Node.js",
    "SQL",
    "AWS",
    "TypeScript",
    "Marketing Digital",
    "SEO",
    "Google Analytics",
    "Photoshop",
    "Excel",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Análisis y Reportes</h1>
        <p className="text-gray-600">Estadísticas detalladas de los candidatos procesados por TalentMatch AI</p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123</div>
            <p className="text-xs text-muted-foreground">+15% este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.5</div>
            <p className="text-xs text-muted-foreground">+2.1 puntos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidatos Top (90+)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">14.6% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procesados Hoy</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribución por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Departamento</CardTitle>
            <CardDescription>Candidatos clasificados por área de especialización</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{dept.name}</span>
                  <span className="text-sm text-gray-600">
                    {dept.count} ({dept.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Distribución por Nivel Educativo */}
        <Card>
          <CardHeader>
            <CardTitle>Nivel Educativo</CardTitle>
            <CardDescription>Distribución de candidatos por formación académica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {educationStats.map((edu, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{edu.name}</span>
                  <span className="text-sm text-gray-600">
                    {edu.count} ({edu.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${edu.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Distribución por Nivel Jerárquico */}
        <Card>
          <CardHeader>
            <CardTitle>Nivel Jerárquico</CardTitle>
            <CardDescription>Experiencia y seniority de los candidatos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hierarchicalStats.map((hier, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{hier.name}</span>
                  <span className="text-sm text-gray-600">
                    {hier.count} ({hier.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${hier.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Habilidades Más Comunes */}
        <Card>
          <CardHeader>
            <CardTitle>Habilidades Más Demandadas</CardTitle>
            <CardDescription>Skills más frecuentes en los currículums procesados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencias Recientes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tendencias Recientes</CardTitle>
          <CardDescription>Insights y patrones identificados en los últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">📈 Crecimiento</h4>
              <p className="text-sm text-gray-600">Aumento del 25% en candidatos de Desarrollo de Software</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">🎯 Calidad</h4>
              <p className="text-sm text-gray-600">Puntuación promedio mejoró 3.2 puntos este mes</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-purple-700 mb-2">🔥 Trending</h4>
              <p className="text-sm text-gray-600">React y TypeScript son las skills más mencionadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
