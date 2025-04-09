"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { productores, atenciones } from "@/lib/data"
import { Search, Plus, Eye, MoreHorizontal, Pencil } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
// import { useSession } from "next-auth/react"

export default function ProductoresPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [filtro, setFiltro] = useState("")
  const [productoresData, setProductoresData] = useState<any[]>([])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Cargar datos de productores con conteo de atenciones
  useEffect(() => {
    if (user && !isLoading) {
      // Añadir conteo de atenciones a cada productor
      const productoresConAtenciones = productores.map((productor) => {
        const numAtenciones = atenciones.filter((a) => a.productorId === productor.id).length
        return {
          ...productor,
          numAtenciones,
        }
      })
      setProductoresData(productoresConAtenciones)
    }
  }, [user, isLoading])

  // Filtrar productores
  const productoresFiltrados = productoresData.filter((productor) => {
    if (!filtro) return true

    const searchTerm = filtro.toLowerCase()
    return (
      productor.nombre.toLowerCase().includes(searchTerm) ||
      productor.cedula.toLowerCase().includes(searchTerm) ||
      productor.telefono.toLowerCase().includes(searchTerm) ||
      (productor.correo && productor.correo.toLowerCase().includes(searchTerm))
    )
  })

  if (isLoading) {
    return <div className="container mx-auto py-10 text-center">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Productores</CardTitle>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Productor
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, cédula, teléfono..."
              className="w-full pl-8 py-2"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Atenciones</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No se encontraron productores
                    </TableCell>
                  </TableRow>
                ) : (
                  productoresFiltrados.map((productor) => (
                    <TableRow key={productor.id}>
                      <TableCell className="font-medium">{productor.cedula}</TableCell>
                      <TableCell>{productor.nombre}</TableCell>
                      <TableCell>{productor.telefono}</TableCell>
                      <TableCell>{productor.correo || "—"}</TableCell>
                      <TableCell>{productor.numAtenciones}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/productores/${productor.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/productores/${productor.id}/editar`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
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
