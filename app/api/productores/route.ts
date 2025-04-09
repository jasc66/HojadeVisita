import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { productores } from "@/lib/data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    // Usar datos simulados en lugar de consultar la base de datos
    let filteredData = [...productores]

    // Aplicar filtros de búsqueda si existen
    if (search) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter(
        (productor) =>
          productor.nombre.toLowerCase().includes(searchLower) ||
          productor.cedula.toLowerCase().includes(searchLower) ||
          productor.telefono.toLowerCase().includes(searchLower) ||
          (productor.correo && productor.correo.toLowerCase().includes(searchLower)),
      )
    }

    // Añadir conteo de atenciones
    const productoresConAtenciones = filteredData.map((productor) => {
      return {
        ...productor,
        _count: {
          atenciones: Math.floor(Math.random() * 10), // Simulamos un conteo aleatorio
        },
      }
    })

    return NextResponse.json(productoresConAtenciones)
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

    // Simular la creación de un productor
    const productor = {
      id: Math.random().toString(36).substring(2, 11),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(productor, { status: 201 })
  } catch (error) {
    console.error("Error al crear productor:", error)
    return NextResponse.json({ error: "Error al crear el productor" }, { status: 500 })
  }
}
