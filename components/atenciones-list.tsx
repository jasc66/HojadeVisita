"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// Datos de ejemplo
const atenciones = [
  {
    id: "1",
    consecutivo: "2023-001",
    fecha: "15/04/2023",
    nombreProductor: "Juan Pérez Rodríguez",
    cedula: "101230456",
    region: "Central",
    actividad: "Café",
    medioAtencion: "Presencial",
    requiereSeguimiento: true,
  },
  {
    id: "2",
    consecutivo: "2023-002",
    fecha: "20/04/2023",
    nombreProductor: "María González Sánchez",
    cedula: "203450678",
    region: "Chorotega",
    actividad: "Ganadería",
    medioAtencion: "Virtual",
    requiereSeguimiento: false,
  },
  {
    id: "3",
    consecutivo: "2023-003",
    fecha: "25/04/2023",
    nombreProductor: "Carlos Jiménez Vargas",
    cedula: "304560789",
    region: "Brunca",
    actividad: "Hortalizas",
    medioAtencion: "Presencial",
    requiereSeguimiento: true,
  },
  {
    id: "4",
    consecutivo: "2023-004",
    fecha: "02/05/2023",
    nombreProductor: "Ana Ramírez Castro",
    cedula: "405670891",
    region: "Huetar Norte",
    actividad: "Frutales",
    medioAtencion: "Virtual",
    requiereSeguimiento: false,
  },
  {
    id: "5",
    consecutivo: "2023-005",
    fecha: "10/05/2023",
    nombreProductor: "Roberto Méndez Solís",
    cedula: "506780912",
    region: "Pacífico Central",
    actividad: "Apicultura",
    medioAtencion: "Presencial",
    requiereSeguimiento: true,
  },
]

export function AtencionesList() {
  const [data, setData] = useState(atenciones)
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este registro?")) {
      setData(data.filter((item) => item.id !== id))
      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado correctamente.",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Consecutivo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Productor</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Región</TableHead>
            <TableHead>Actividad</TableHead>
            <TableHead>Medio</TableHead>
            <TableHead>Seguimiento</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                No hay registros de atenciones
              </TableCell>
            </TableRow>
          ) : (
            data.map((atencion) => (
              <TableRow key={atencion.id}>
                <TableCell className="font-medium">{atencion.consecutivo}</TableCell>
                <TableCell>{atencion.fecha}</TableCell>
                <TableCell>{atencion.nombreProductor}</TableCell>
                <TableCell>{atencion.cedula}</TableCell>
                <TableCell>{atencion.region}</TableCell>
                <TableCell>{atencion.actividad}</TableCell>
                <TableCell>{atencion.medioAtencion}</TableCell>
                <TableCell>
                  {atencion.requiereSeguimiento ? (
                    <Badge variant="default" className="bg-green-500">
                      Sí
                    </Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/atenciones/${atencion.id}`}>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/atenciones/${atencion.id}/editar`}>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => handleDelete(atencion.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
