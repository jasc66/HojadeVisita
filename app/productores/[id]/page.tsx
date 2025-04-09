"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { obtenerProductorPorId, obtenerAtencionesCompletas } from "@/lib/data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Phone, Mail, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
// Eliminar la importación de useSession
// import { useSession } from "next-auth/react"

export default function DetalleProductorPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [productor, setProductor] = useState<any>(null)
  const [atencionesProductor, setAtencionesProductor] = useState<any[]>([])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Cargar datos del productor
  useEffect(() => {
    if (user && params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      const productorData = obtenerProductorPorId(id)

      if (!productorData) {
        setError("No se encontró el productor solicitado")
        setLoadingData(false)
        return
      }

      setProductor(productorData)

      // Obtener atenciones del productor
      const todasAtenciones = obtenerAtencionesCompletas()
      const atencionesDelProductor = todasAtenciones.filter((a) => a.productorId === id)
      setAtencionesProductor(atencionesDelProductor)

      setLoadingData(false)
    }
  }, [user, params.id])

  if (isLoading || loadingData) {
    return <div className="container mx-auto py-10 text-center">Cargando...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => router.push("/productores")}>Volver a Productores</Button>
        </div>
      </div>
    )
  }

  if (!productor) {
    return <div className="container mx-auto py-10 text-center">No se encontró el productor</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" onClick={() => router.back()} className="mb-6 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información del Productor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="font-medium">{productor.nombre}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-5 w-5 mr-2 flex items-center justify-center text-muted-foreground">
                  <span className="text-xs font-bold">ID</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cédula</p>
                  <p>{productor.cedula}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p>{productor.telefono}</p>
                </div>
              </div>

              {productor.correo && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Correo</p>
                    <p>{productor.correo}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground">Estadísticas</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 p-3 rounded-md text-center">
                    <p className="text-2xl font-bold">{atencionesProductor.length}</p>
                    <p className="text-xs text-muted-foreground">Atenciones</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md text-center">
                    <p className="text-2xl font-bold">
                      {atencionesProductor.filter((a) => a.requiereSeguimiento).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Con seguimiento</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Historial de Atenciones</CardTitle>
          </CardHeader>
          <CardContent>
            {atencionesProductor.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No hay atenciones registradas para este productor
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Consecutivo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Actividad</TableHead>
                      <TableHead>Medio</TableHead>
                      <TableHead>Seguimiento</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atencionesProductor.map((atencion) => (
                      <TableRow key={atencion.id}>
                        <TableCell className="font-medium">{atencion.consecutivo}</TableCell>
                        <TableCell>{atencion.fecha}</TableCell>
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
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/atenciones/${atencion.id}`)}>
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
