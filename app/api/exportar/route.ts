import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const { fields, filters, format } = data

    // Construir la consulta base
    const where: any = {}

    // Aplicar filtros
    if (filters.dateFrom && filters.dateTo) {
      where.fecha = {
        gte: new Date(filters.dateFrom),
        lte: new Date(filters.dateTo),
      }
    } else if (filters.dateFrom) {
      where.fecha = {
        gte: new Date(filters.dateFrom),
      }
    } else if (filters.dateTo) {
      where.fecha = {
        lte: new Date(filters.dateTo),
      }
    }

    if (filters.region) {
      where.agencia = {
        region: {
          id: filters.region,
        },
      }
    }

    // Determinar qué campos incluir en la consulta
    const select: any = {}

    // Mapear los campos seleccionados a la estructura de Prisma
    if (fields.consecutivo) select.consecutivo = true
    if (fields.fecha) select.fecha = true
    if (fields.tipoContacto) select.tipoContacto = true

    // Incluir relaciones según los campos seleccionados
    const include: any = {}

    if (fields.nombreProductor || fields.cedulaProductor || fields.telefonoProductor || fields.correoProductor) {
      include.productor = {
        select: {
          id: true,
          ...(fields.nombreProductor && { nombre: true }),
          ...(fields.cedulaProductor && { cedula: true }),
          ...(fields.telefonoProductor && { telefono: true }),
          ...(fields.correoProductor && { correo: true }),
        },
      }
    }

    if (fields.region || fields.agencia) {
      include.agencia = {
        select: {
          id: true,
          ...(fields.agencia && { nombre: true }),
          ...(fields.region && {
            region: {
              select: {
                nombre: true,
              },
            },
          }),
        },
      }
    }

    if (fields.funcionario) {
      include.funcionario = {
        select: {
          id: true,
          nombre: true,
          email: true,
        },
      }
    }

    if (fields.actividad) select.actividad = true
    if (fields.areaAtendida) select.areaAtendida = true
    if (fields.medioAtencion) {
      select.medioAtencionTipo = true
      select.medioAtencionSubtipo = true
    }
    if (fields.asuntoRecomendacion) select.asuntoRecomendacion = true
    if (fields.observacion) select.observacion = true
    if (fields.requiereSeguimiento) select.requiereSeguimiento = true

    // Obtener los datos
    const atenciones = await prisma.atencion.findMany({
      where,
      select,
      include: Object.keys(include).length > 0 ? include : undefined,
      orderBy: {
        fecha: "desc",
      },
    })

    // Procesar los datos según el formato solicitado
    let exportData

    if (format === "csv") {
      // Generar CSV
      exportData = {
        type: "csv",
        filename: `atenciones_${new Date().toISOString().split("T")[0]}.csv`,
        data: atenciones,
      }
    } else if (format === "excel") {
      // Generar Excel
      exportData = {
        type: "excel",
        filename: `atenciones_${new Date().toISOString().split("T")[0]}.xlsx`,
        data: atenciones,
      }
    } else if (format === "pdf") {
      // Generar PDF
      exportData = {
        type: "pdf",
        filename: `atenciones_${new Date().toISOString().split("T")[0]}.pdf`,
        data: atenciones,
      }
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error("Error al exportar datos:", error)
    return NextResponse.json({ error: "Error al exportar los datos" }, { status: 500 })
  }
}
