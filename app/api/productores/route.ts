import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    // Construir la consulta base
    const where: any = {}

    // Agregar filtros de búsqueda si existen
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { cedula: { contains: search, mode: "insensitive" } },
        { telefono: { contains: search, mode: "insensitive" } },
        { correo: { contains: search, mode: "insensitive" } },
      ]
    }

    // Obtener los productores
    const productores = await prisma.productor.findMany({
      where,
      orderBy: {
        nombre: "asc",
      },
      include: {
        _count: {
          select: {
            atenciones: true,
          },
        },
      },
    })

    return NextResponse.json(productores)
  } catch (error) {
    console.error("Error al obtener productores:", error)
    return NextResponse.json({ error: "Error al obtener los productores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Verificar si ya existe un productor con la misma cédula
    const existingProductor = await prisma.productor.findUnique({
      where: {
        cedula: data.cedula,
      },
    })

    if (existingProductor) {
      return NextResponse.json({ error: "Ya existe un productor con esta cédula" }, { status: 400 })
    }

    // Crear el productor
    const productor = await prisma.productor.create({
      data: {
        cedula: data.cedula,
        nombre: data.nombre,
        telefono: data.telefono,
        correo: data.correo || null,
      },
    })

    return NextResponse.json(productor, { status: 201 })
  } catch (error) {
    console.error("Error al crear productor:", error)
    return NextResponse.json({ error: "Error al crear el productor" }, { status: 500 })
  }
}
