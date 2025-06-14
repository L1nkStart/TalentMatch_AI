import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const department = searchParams.get("department") || ""
  const education = searchParams.get("education") || ""
  const hierarchical = searchParams.get("hierarchical") || ""
  const minScore = searchParams.get("minScore") || "0"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    let query = supabase.from("candidates").select("*", { count: "exact" })

    // Filtros de búsqueda
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,executive_summary.ilike.%${search}%`)
    }

    if (department) {
      query = query.eq("department", department)
    }

    if (education) {
      query = query.eq("education_level", education)
    }

    if (hierarchical) {
      query = query.eq("hierarchical_level", hierarchical)
    }

    if (Number.parseInt(minScore) > 0) {
      query = query.gte("relevance_score", Number.parseInt(minScore))
    }

    // Paginación y ordenamiento
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.order("relevance_score", { ascending: false }).range(from, to)

    if (error) {
      throw error
    }

    return NextResponse.json({
      candidates: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("Error fetching candidates:", error)
    return NextResponse.json({ error: "Error al obtener candidatos" }, { status: 500 })
  }
}
