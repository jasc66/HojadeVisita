import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { obtenerAtencionesCompletas } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { fields, filters } = await request.json()

    // Usar datos simulados en lugar de consultar la base de datos
    const atenciones = obtenerAtencionesCompletas()

    // Aplicar filtros
    let filteredData = [...atenciones]

    // Aplicar filtros de fecha
    if (filters.dateFrom && filters.dateTo) {
      const fromDate = new Date(filters.dateFrom)
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // Final del día

      filteredData = filteredData.filter((atencion) => {
        const fechaAtencion = new Date(atencion.fecha)
        return fechaAtencion >= fromDate && fechaAtencion <= toDate
      })
    } else if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filteredData = filteredData.filter((atencion) => new Date(atencion.fecha) >= fromDate)
    } else if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // Final del día
      filteredData = filteredData.filter((atencion) => new Date(atencion.fecha) <= toDate)
    }

    // Filtrar por región
    if (filters.region && filters.region !== "all") {
      filteredData = filteredData.filter((atencion) => atencion.region?.id === filters.region)
    }

    return NextResponse.json({ data: filteredData })
  } catch (error) {
    console.error("Error al exportar datos:", error)
    return NextResponse.json({ error: "Error al exportar los datos" }, { status: 500 })
  }
}
