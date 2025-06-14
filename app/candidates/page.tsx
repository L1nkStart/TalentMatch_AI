"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, User, Mail, Phone, Star } from "lucide-react"
import type { Candidate } from "@/lib/supabase"

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("")
  const [education, setEducation] = useState("")
  const [hierarchical, setHierarchical] = useState("")
  const [minScore, setMinScore] = useState([0])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const departments = [
    "Desarrollo de Software",
    "Marketing Digital",
    "Recursos Humanos",
    "Finanzas",
    "Ventas",
    "Diseño",
    "Operaciones",
  ]

  const educationLevels = ["Bachillerato", "Técnico", "Licenciatura", "Ingeniería", "Máster", "Doctorado"]

  const hierarchicalLevels = ["Junior", "Semi-Senior", "Senior", "Lead", "Manager", "Director"]

  useEffect(() => {
    fetchCandidates()
  }, [search, department, education, hierarchical, minScore, currentPage])

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        department,
        education,
        hierarchical,
        minScore: minScore[0].toString(),
        page: currentPage.toString(),
        limit: "12",
      })

      const response = await fetch(`/api/candidates?${params}`)
      const data = await response.json()

      setCandidates(data.candidates || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Error fetching candidates:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearch("")
    setDepartment("")
    setEducation("")
    setHierarchical("")
    setMinScore([0])
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Base de Datos de Candidatos</h1>
        <p className="text-gray-600">Busca y filtra candidatos procesados automáticamente por IA</p>
      </div>

      {/* Filtros */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email o resumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={education} onValueChange={setEducation}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel Educativo" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={hierarchical} onValueChange={setHierarchical}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel Jerárquico" />
              </SelectTrigger>
              <SelectContent>
                {hierarchicalLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Puntuación mínima: {minScore[0]}</label>
            <Slider value={minScore} onValueChange={setMinScore} max={100} step={5} className="w-full" />
          </div>

          <div className="flex gap-2">
            <Button onClick={fetchCandidates}>Aplicar Filtros</Button>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Candidatos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-4 w-4" />
                        {candidate.full_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {candidate.email}
                      </CardDescription>
                      {candidate.phone && (
                        <CardDescription className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {candidate.phone}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg">{candidate.relevance_score}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {candidate.department && <Badge variant="secondary">{candidate.department}</Badge>}
                    {candidate.hierarchical_level && <Badge variant="outline">{candidate.hierarchical_level}</Badge>}
                  </div>

                  {candidate.education_level && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Educación: {candidate.education_level}</p>
                    </div>
                  )}

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Habilidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 4} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {candidate.executive_summary && (
                    <div>
                      <p className="text-sm text-gray-600 line-clamp-3">{candidate.executive_summary}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Procesado: {new Date(candidate.processed_at).toLocaleDateString()}</span>
                    {candidate.resume_url && (
                      <Button size="sm" variant="outline">
                        Ver CV
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
