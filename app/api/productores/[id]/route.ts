import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productor = await prisma.productor.findUnique({
      where: {
        id: params.id,
      },
      include: {
        atenciones: {
          include: {
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
        },
      },
    })

    if (!productor) {
      return NextResponse.json({ error: "Productor no encontrado" }, { status: 404 })
    }

    return NextResponse.json(productor)
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

    // Verificar si existe otro productor con la misma cédula
    if (data.cedula) {
      const existingProductor = await prisma.productor.findFirst({
        where: {
          cedula: data.cedula,
          id: {
            not: params.id,
          },
        },
      })

      if (existingProductor) {
        return NextResponse.json({ error: "Ya existe otro productor con esta cédula" }, { status: 400 })
      }
    }

    // Actualizar el productor
    const productor = await prisma.productor.update({
      where: {
        id: params.id,
      },
      data: {
        nombre: data.nombre,
        cedula: data.cedula,
        telefono: data.telefono,
        correo: data.correo || null,
      },
    })

    return NextResponse.json(productor)
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

    // Verificar si el productor tiene atenciones asociadas
    const atencionesCount = await prisma.atencion.count({
      where: {
        productorId: params.id,
      },
    })

    if (atencionesCount > 0) {
      return NextResponse.json(
        {
          error: "No se puede eliminar el productor porque tiene atenciones asociadas",
        },
        { status: 400 },
      )
    }

    // Eliminar el productor
    await prisma.productor.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar productor:", error)
    return NextResponse.json({ error: "Error al eliminar el productor" }, { status: 500 })
  }
}
