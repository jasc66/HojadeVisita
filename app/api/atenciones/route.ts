import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const region = searchParams.get("region") || ""

    const skip = (page - 1) * limit

    // Construir la consulta base
    const where: any = {}

    // Agregar filtros de búsqueda si existen
    if (search) {
      where.OR = [
        { productor: { nombre: { contains: search, mode: "insensitive" } } },
        { productor: { cedula: { contains: search, mode: "insensitive" } } },
        { consecutivo: { contains: search, mode: "insensitive" } },
        { actividad: { contains: search, mode: "insensitive" } },
      ]
    }

    // Filtrar por región si se especifica
    if (region) {
      where.agencia = {
        region: {
          nombre: region,
        },
      }
    }

    // Obtener el total de registros que coinciden con la búsqueda
    const total = await prisma.atencion.count({ where })

    // Obtener los registros paginados
    const atenciones = await prisma.atencion.findMany({
      where,
      include: {
        productor: true,
        funcionario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        agencia: {
          include: {
            region: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
      skip,
      take: limit,
    })

    return NextResponse.json({
      data: atenciones,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error al obtener atenciones:", error)
    return NextResponse.json({ error: "Error al obtener las atenciones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Generar consecutivo automático
    const year = new Date().getFullYear()
    const lastAtencion = await prisma.atencion.findFirst({
      where: {
        consecutivo: {
          startsWith: `${year}-`,
        },
      },
      orderBy: {
        consecutivo: "desc",
      },
    })

    let consecutivoNum = 1
    if (lastAtencion) {
      const lastNum = Number.parseInt(lastAtencion.consecutivo.split("-")[1])
      consecutivoNum = lastNum + 1
    }

    const consecutivo = `${year}-${consecutivoNum.toString().padStart(3, "0")}`

    // Buscar o crear el productor
    let productor = await prisma.productor.findUnique({
      where: {
        cedula: data.cedulaProductor,
      },
    })

    if (!productor) {
      productor = await prisma.productor.create({
        data: {
          cedula: data.cedulaProductor,
          nombre: data.nombreProductor,
          telefono: data.telefonoProductor,
          correo: data.correoProductor || null,
        },
      })
    }

    // Crear la atención
    const atencion = await prisma.atencion.create({
      data: {
        consecutivo,
        tipoContacto: data.tipoContacto,
        fecha: data.fecha,
        funcionarioId: session.user.id,
        agenciaId: data.agenciaId,
        productorId: productor.id,
        actividad: data.actividad,
        areaAtendida: data.areaAtendida,
        medioAtencionTipo: data.medioAtencion.tipo,
        medioAtencionSubtipo: data.medioAtencion.subtipo,
        asuntoRecomendacion: data.asuntoRecomendacion,
        observacion: data.observacion || null,
        requiereSeguimiento: data.requiereSeguimiento,
      },
    })

    return NextResponse.json(atencion, { status: 201 })
  } catch (error) {
    console.error("Error al crear atención:", error)
    return NextResponse.json({ error: "Error al crear la atención" }, { status: 500 })
  }
}
