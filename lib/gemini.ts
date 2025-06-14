import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeResume(resumeText: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `
    Analiza el siguiente currículum y proporciona la información en formato JSON:

    ${resumeText}

    Devuelve un JSON con esta estructura exacta:
    {
      "department": "departamento sugerido (ej: Desarrollo de Software, Marketing Digital, Recursos Humanos, Finanzas, Ventas, etc.)",
      "education_level": "nivel educativo más alto (ej: Bachillerato, Técnico, Licenciatura, Ingeniería, Máster, Doctorado)",
      "hierarchical_level": "nivel jerárquico sugerido (Junior, Semi-Senior, Senior, Lead, Manager, Director)",
      "skills": ["array", "de", "habilidades", "técnicas", "y", "blandas"],
      "executive_summary": "resumen ejecutivo de 2-3 líneas destacando experiencia y fortalezas principales",
      "relevance_score": número del 1 al 100 indicando la calidad del perfil
    }

    Responde SOLO con el JSON, sin texto adicional.
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Limpiar la respuesta para extraer solo el JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error("No se pudo extraer JSON válido de la respuesta")
  } catch (error) {
    console.error("Error analyzing resume:", error)
    throw error
  }
}
