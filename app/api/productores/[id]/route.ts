import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { obtenerProductorPorId, obtenerAtencionesCompletas } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productor = obtenerProductorPorId(params.id)

    if (!productor) {
      return NextResponse.json({ error: "Productor no encontrado" }, { status: 404 })
    }

    // Obtener atenciones del productor
    const todasAtenciones = obtenerAtencionesCompletas()
    const atencionesDelProductor = todasAtenciones.filter((a) => a.productorId === params.id)

    // Combinar datos
    const productorConAtenciones = {
      ...productor,
      atenciones: atencionesDelProductor,
    }

    return NextResponse.json(productorConAtenciones)
  } catch (error) {
    console.error("Error al obtener productor:", error)
    return NextResponse.json({ error: "Error al obtener el productor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const productor = obtenerProductorPorId(params.id)

    if (!productor) {
      return NextResponse.json({ error: "Productor no encontrado" }, { status: 404 })
    }

    // Simular actualización
    const productorActualizado = {
      ...productor,
      ...data,
      updatedAt: new Date(),
    }

    return NextResponse.json(productorActualizado)
  } catch (error) {
    console.error("Error al actualizar productor:", error)
    return NextResponse.json({ error: "Error al actualizar el productor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Simular eliminación
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar productor:", error)
    return NextResponse.json({ error: "Error al eliminar el productor" }, { status: 500 })
  }
}
