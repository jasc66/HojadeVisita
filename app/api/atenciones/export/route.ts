import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { fields, filters } = await request.json()

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

    if (filters.region && filters.region !== "all") {
      where.agencia = {
        region: {
          id: filters.region,
        },
      }
    }

    // Determinar qué incluir en la consulta
    const include: any = {}

    if (fields.nombreProductor || fields.cedulaProductor || fields.telefonoProductor || fields.correoProductor) {
      include.productor = true
    }

    if (fields.region || fields.agencia) {
      include.agencia = {
        include: {
          region: fields.region,
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

    // Obtener los datos
    const atenciones = await prisma.atencion.findMany({
      where,
      include: Object.keys(include).length > 0 ? include : undefined,
      orderBy: {
        fecha: "desc",
      },
    })

    return NextResponse.json({ data: atenciones })
  } catch (error) {
    console.error("Error al exportar datos:", error)
    return NextResponse.json({ error: "Error al exportar los datos" }, { status: 500 })
  }
}
