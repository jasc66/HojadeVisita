"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import {
  obtenerAtencionPorId,
  obtenerProductorPorId,
  obtenerAgenciaPorId,
  obtenerRegionPorId,
  obtenerUsuarioPorId,
} from "@/lib/data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Pencil } from "lucide-react"

export default function DetalleAtencionPage() {
  const router = useRouter()
  const params = useParams()
  const { status } = useSession()
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [atencion, setAtencion] = useState<any>(null)
  const [productor, setProductor] = useState<any>(null)
  const [agencia, setAgencia] = useState<any>(null)
  const [region, setRegion] = useState<any>(null)
  const [funcionario, setFuncionario] = useState<any>(null)

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Cargar datos de la atención
  useEffect(() => {
    if (status === "authenticated" && params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      const atencionData = obtenerAtencionPorId(id)

      if (!atencionData) {
        setError("No se encontró la atención solicitada")
        setLoadingData(false)
        return
      }

      setAtencion(atencionData)

      // Cargar datos relacionados
      const productorData = obtenerProductorPorId(atencionData.productorId)
      const agenciaData = obtenerAgenciaPorId(atencionData.agenciaId)
      const funcionarioData = obtenerUsuarioPorId(atencionData.funcionarioId)

      if (!productorData || !agenciaData || !funcionarioData) {
        setError("Error al cargar los datos relacionados")
        setLoadingData(false)
        return
      }

      setProductor(productorData)
      setAgencia(agenciaData)
      setFuncionario(funcionarioData)

      // Cargar región
      const regionData = obtenerRegionPorId(agenciaData.regionId)
      if (regionData) {
        setRegion(regionData)
      }

      setLoadingData(false)
    }
  }, [status, params.id])

  if (status === "loading" || loadingData) {
    return <div className="container mx-auto py-10 text-center">Cargando...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => router.push("/atenciones")}>Volver a Atenciones</Button>
        </div>
      </div>
    )
  }

  if (!atencion) {
    return <div className="container mx-auto py-10 text-center">No se encontró la atención</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <Button onClick={() => router.push(`/atenciones/${params.id}/editar`)} className="flex items-center gap-2">
          <Pencil className="h-4 w-4" /> Editar
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-green-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>DETALLE DE ATENCIÓN</CardTitle>
              <CardDescription className="text-lg font-medium mt-1">SERVICIO DE EXTENSIÓN AGROPECUARIA</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">N° {atencion.consecutivo}</p>
              <Badge className="mt-1">{atencion.tipoContacto}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Fecha</h3>
                <p className="text-base">{atencion.fecha}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Funcionario</h3>
                <p className="text-base">{funcionario.nombre}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-lg mb-3">Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Región</h3>
                  <p className="text-base">{region?.nombre}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Agencia</h3>
                  <p className="text-base">{agencia.nombre}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                  <p className="text-base">{agencia.telefono}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-lg mb-3">Información del Productor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                  <p className="text-base">{productor.nombre}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cédula</h3>
                  <p className="text-base">{productor.cedula}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                  <p className="text-base">{productor.telefono}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Correo</h3>
                  <p className="text-base">{productor.correo || "No especificado"}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-lg mb-3">Detalles de la Atención</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Actividad/Rubro</h3>
                  <p className="text-base">{atencion.actividad}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Área Atendida</h3>
                  <p className="text-base">{atencion.areaAtendida}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Medio de Atención</h3>
                  <p className="text-base">
                    {atencion.medioAtencionTipo} - {atencion.medioAtencionSubtipo}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Requiere Seguimiento</h3>
                  <p className="text-base">{atencion.requiereSeguimiento ? "Sí" : "No"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Asunto y Recomendación Técnica</h3>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="text-base whitespace-pre-wrap">{atencion.asuntoRecomendacion}</p>
                  </div>
                </div>

                {atencion.observacion && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Observaciones</h3>
                    <div className="mt-1 p-3 bg-muted/30 rounded-md">
                      <p className="text-base whitespace-pre-wrap">{atencion.observacion}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t">
          <div className="text-sm text-muted-foreground">
            <p>Creado: {atencion.fecha}</p>
          </div>
          <Button variant="outline" onClick={() => window.print()}>
            Imprimir
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
