import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { obtenerAtencionesCompletas } from "@/lib/data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const region = searchParams.get("region") || ""

    // Usar datos simulados en lugar de consultar la base de datos
    const atenciones = obtenerAtencionesCompletas()

    // Aplicar filtros
    let filteredData = [...atenciones]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter(
        (atencion) =>
          atencion.productor.nombre.toLowerCase().includes(searchLower) ||
          atencion.productor.cedula.toLowerCase().includes(searchLower) ||
          atencion.consecutivo.toLowerCase().includes(searchLower) ||
          atencion.actividad.toLowerCase().includes(searchLower),
      )
    }

    if (region) {
      filteredData = filteredData.filter((atencion) => atencion.region?.nombre === region)
    }

    // Calcular paginación
    const total = filteredData.length
    const skip = (page - 1) * limit
    const paginatedData = filteredData.slice(skip, skip + limit)

    return NextResponse.json({
      data: paginatedData,
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

    // Simular la creación de una atención
    // En un entorno real, esto usaría Prisma para guardar en la base de datos

    // Generar un ID único
    const id = Math.random().toString(36).substring(2, 11)

    // Generar consecutivo
    const year = new Date().getFullYear()
    const consecutivo = `${year}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`

    const atencion = {
      id,
      consecutivo,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(atencion, { status: 201 })
  } catch (error) {
    console.error("Error al crear atención:", error)
    return NextResponse.json({ error: "Error al crear la atención" }, { status: 500 })
  }
}
