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

    const data = await request.json()
    const { fields, filters, format } = data

    // Usar datos simulados en lugar de consultar la base de datos
    const atenciones = obtenerAtencionesCompletas()

    // Aplicar filtros si es necesario
    let filteredData = [...atenciones]

    // Filtrar por región
    if (filters.region && filters.region !== "all") {
      filteredData = filteredData.filter((atencion) => atencion.region?.id === filters.region)
    }

    // Filtrar por fecha
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filteredData = filteredData.filter((atencion) => new Date(atencion.fecha) >= fromDate)
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // Final del día
      filteredData = filteredData.filter((atencion) => new Date(atencion.fecha) <= toDate)
    }

    // Procesar los datos según el formato solicitado
    let exportData

    if (format === "csv") {
      // Generar CSV
      exportData = {
        type: "csv",
        filename: `atenciones_${new Date().toISOString().split("T")[0]}.csv`,
        data: filteredData,
      }
    } else if (format === "excel") {
      // Generar Excel
      exportData = {
        type: "excel",
        filename: `atenciones_${new Date().toISOString().split("T")[0]}.xlsx`,
        data: filteredData,
      }
    } else if (format === "pdf") {
      // Generar PDF
      exportData = {
        type: "pdf",
        filename: `atenciones_${new Date().toISOString().split("T")[0]}.pdf`,
        data: filteredData,
      }
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error("Error al exportar datos:", error)
    return NextResponse.json({ error: "Error al exportar los datos" }, { status: 500 })
  }
}
