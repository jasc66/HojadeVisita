"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileDown, Search, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { obtenerAtencionesCompletas } from "@/lib/data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AtencionesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [atenciones, setAtenciones] = useState<any[]>([])
  const [filtro, setFiltro] = useState("")

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Cargar atenciones
  useEffect(() => {
    if (status === "authenticated") {
      const data = obtenerAtencionesCompletas()
      setAtenciones(data)
    }
  }, [status])

  // Filtrar atenciones
  const atencionesFiltered = atenciones.filter((atencion) => {
    if (!filtro) return true

    const searchTerm = filtro.toLowerCase()
    return (
      atencion.consecutivo.toLowerCase().includes(searchTerm) ||
      atencion.productor.nombre.toLowerCase().includes(searchTerm) ||
      atencion.productor.cedula.toLowerCase().includes(searchTerm) ||
      atencion.region?.nombre.toLowerCase().includes(searchTerm) ||
      atencion.actividad.toLowerCase().includes(searchTerm)
    )
  })

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este registro?")) {
      // Simulamos la eliminación
      setAtenciones(atenciones.filter((a) => a.id !== id))

      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado correctamente.",
      })
    }
  }

  if (status === "loading") {
    return <div className="container mx-auto py-10 text-center">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Atenciones a Productores</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Link href="/formulario">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Atención
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar por productor, cédula, región..."
              className="w-full rounded-md border border-input pl-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consecutivo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Productor</TableHead>
                  <TableHead>Región</TableHead>
                  <TableHead>Actividad</TableHead>
                  <TableHead>Medio</TableHead>
                  <TableHead>Seguimiento</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atencionesFiltered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No hay registros de atenciones
                    </TableCell>
                  </TableRow>
                ) : (
                  atencionesFiltered.map((atencion) => (
                    <TableRow key={atencion.id}>
                      <TableCell className="font-medium">{atencion.consecutivo}</TableCell>
                      <TableCell>{atencion.fecha}</TableCell>
                      <TableCell>{atencion.productor.nombre}</TableCell>
                      <TableCell>{atencion.region?.nombre}</TableCell>
                      <TableCell>{atencion.actividad}</TableCell>
                      <TableCell>{atencion.medioAtencionTipo}</TableCell>
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
                            <DropdownMenuItem onClick={() => router.push(`/atenciones/${atencion.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/atenciones/${atencion.id}/editar`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
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
        </CardContent>
      </Card>
    </div>
  )
}
