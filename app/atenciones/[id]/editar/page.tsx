"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
// Eliminar la importación de useSession
// import { useSession } from "next-auth/react"
import { regiones, agencias, obtenerAtencionPorId, obtenerProductorPorId, obtenerAgenciaPorId } from "@/lib/data"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Añadir la importación de useAuth
import { useAuth } from "@/lib/auth-context"

export default function EditarAtencionPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  // Reemplazar esta línea:
  // const { data: session, status } = useSession()
  // Por esta:
  const { user, isLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [tipoContacto, setTipoContacto] = useState("Contacto")
  const [regionId, setRegionId] = useState("")
  const [agenciaId, setAgenciaId] = useState("")
  const [medioAtencion, setMedioAtencion] = useState("Presencial")
  const [medioAtencionSubtipo, setMedioAtencionSubtipo] = useState("Oficina")
  const [requiereSeguimiento, setRequiereSeguimiento] = useState(false)
  const [agenciasFiltradas, setAgenciasFiltradas] = useState<typeof agencias>([])
  const [formData, setFormData] = useState({
    fecha: "",
    nombreProductor: "",
    cedulaProductor: "",
    telefonoProductor: "",
    correoProductor: "",
    actividad: "",
    areaAtendida: "",
    asuntoRecomendacion: "",
    observacion: "",
  })

  // Redirigir si no está autenticado
  useEffect(() => {
    // Reemplazar status === "unauthenticated" por !user && !isLoading
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [isLoading, router, user])

  // Cargar datos de la atención
  useEffect(() => {
    // Reemplazar todas las referencias a status por isLoading
    if (!isLoading && params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      const atencion = obtenerAtencionPorId(id)

      if (!atencion) {
        setError("No se encontró la atención solicitada")
        setLoadingData(false)
        return
      }

      const productor = obtenerProductorPorId(atencion.productorId)
      const agencia = obtenerAgenciaPorId(atencion.agenciaId)

      if (!productor || !agencia) {
        setError("Error al cargar los datos relacionados")
        setLoadingData(false)
        return
      }

      // Encontrar la región de la agencia
      const regionId = agencia.regionId
      setRegionId(regionId)

      // Filtrar agencias por región
      setAgenciasFiltradas(agencias.filter((a) => a.regionId === regionId))

      // Establecer valores en el formulario
      setTipoContacto(atencion.tipoContacto)
      setAgenciaId(atencion.agenciaId)
      setMedioAtencion(atencion.medioAtencionTipo)
      setMedioAtencionSubtipo(atencion.medioAtencionSubtipo)
      setRequiereSeguimiento(atencion.requiereSeguimiento)

      setFormData({
        fecha: atencion.fecha,
        nombreProductor: productor.nombre,
        cedulaProductor: productor.cedula,
        telefonoProductor: productor.telefono,
        correoProductor: productor.correo || "",
        actividad: atencion.actividad,
        areaAtendida: atencion.areaAtendida,
        asuntoRecomendacion: atencion.asuntoRecomendacion,
        observacion: atencion.observacion || "",
      })

      setLoadingData(false)
    }
  }, [isLoading, params.id])

  // Filtrar agencias por región
  useEffect(() => {
    if (regionId) {
      setAgenciasFiltradas(agencias.filter((agencia) => agencia.regionId === regionId))
    } else {
      setAgenciasFiltradas([])
    }
  }, [regionId])

  // Actualizar subtipo cuando cambia el tipo de medio de atención
  useEffect(() => {
    if (medioAtencion === "Virtual" && !["Teams", "Telefónico", "Correo"].includes(medioAtencionSubtipo)) {
      setMedioAtencionSubtipo("Teams")
    } else if (medioAtencion === "Presencial" && !["Oficina", "Finca"].includes(medioAtencionSubtipo)) {
      setMedioAtencionSubtipo("Oficina")
    }
  }, [medioAtencion, medioAtencionSubtipo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulamos la actualización
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Atención actualizada",
        description: "La atención ha sido actualizada correctamente.",
      })

      router.push("/atenciones")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la atención.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Reemplazar status === "loading" por isLoading
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
          <Button onClick={() => router.push("/atenciones")}>Volver a Atenciones</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-green-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>EDITAR ATENCIÓN</CardTitle>
              <CardDescription className="text-lg font-medium mt-1">SERVICIO DE EXTENSIÓN AGROPECUARIA</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">ID: {params.id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Label>Tipo de contacto</Label>
                <RadioGroup value={tipoContacto} onValueChange={setTipoContacto} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contacto" id="contacto" />
                    <Label htmlFor="contacto">Contacto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ocasional" id="ocasional" />
                    <Label htmlFor="ocasional">Ocasional</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" name="fecha" type="date" value={formData.fecha} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="region">Región de Desarrollo</Label>
                <Select value={regionId} onValueChange={setRegionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una región" />
                  </SelectTrigger>
                  <SelectContent>
                    {regiones.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agencia">Agencia de Extensión Agropecuaria</Label>
                <Select value={agenciaId} onValueChange={setAgenciaId} disabled={!regionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una agencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {agenciasFiltradas.map((agencia) => (
                      <SelectItem key={agencia.id} value={agencia.id}>
                        {agencia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono de la Agencia</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="Teléfono"
                  value={agenciasFiltradas.find((a) => a.id === agenciaId)?.telefono || ""}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="funcionario">Funcionario</Label>
                <Input
                  id="funcionario"
                  name="funcionario"
                  placeholder="Nombre completo del funcionario"
                  // Reemplazar session?.user.name por user?.nombre
                  value={user?.nombre || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium text-lg mb-4">Información del Productor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombreProductor">Nombre del Productor/a</Label>
                  <Input
                    id="nombreProductor"
                    name="nombreProductor"
                    placeholder="Nombre completo"
                    value={formData.nombreProductor}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cedulaProductor">N° Cédula</Label>
                  <Input
                    id="cedulaProductor"
                    name="cedulaProductor"
                    placeholder="Número de cédula"
                    value={formData.cedulaProductor}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefonoProductor">Teléfono</Label>
                  <Input
                    id="telefonoProductor"
                    name="telefonoProductor"
                    placeholder="Teléfono del productor"
                    value={formData.telefonoProductor}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correoProductor">Correo</Label>
                  <Input
                    id="correoProductor"
                    name="correoProductor"
                    placeholder="Correo electrónico"
                    value={formData.correoProductor}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actividad">Actividad/Rubro</Label>
                  <Input
                    id="actividad"
                    name="actividad"
                    placeholder="Actividad o rubro"
                    value={formData.actividad}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="areaAtendida">Área Atendida</Label>
                  <Input
                    id="areaAtendida"
                    name="areaAtendida"
                    placeholder="Área atendida"
                    value={formData.areaAtendida}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium text-lg mb-4">Medio de atención</h3>
              <div className="space-y-4">
                <RadioGroup value={medioAtencion} onValueChange={setMedioAtencion} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Virtual" id="virtual" />
                    <Label htmlFor="virtual">Virtual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Presencial" id="presencial" />
                    <Label htmlFor="presencial">Presencial</Label>
                  </div>
                </RadioGroup>

                <div className="ml-7">
                  <Select value={medioAtencionSubtipo} onValueChange={setMedioAtencionSubtipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      {medioAtencion === "Virtual" ? (
                        <>
                          <SelectItem value="Teams">Teams</SelectItem>
                          <SelectItem value="Telefónico">Telefónico</SelectItem>
                          <SelectItem value="Correo">Correo</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Oficina">Oficina</SelectItem>
                          <SelectItem value="Finca">Finca</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-2">
                <Label htmlFor="asuntoRecomendacion">Asunto atendido y Recomendación Técnica</Label>
                <Textarea
                  id="asuntoRecomendacion"
                  name="asuntoRecomendacion"
                  placeholder="Describa el asunto atendido y la recomendación técnica brindada"
                  className="min-h-[150px]"
                  value={formData.asuntoRecomendacion}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacion">Observación</Label>
              <Textarea
                id="observacion"
                name="observacion"
                placeholder="Observaciones adicionales"
                className="min-h-[80px]"
                value={formData.observacion}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-start space-x-3 border p-4 rounded-md">
              <input
                type="checkbox"
                id="seguimiento"
                checked={requiereSeguimiento}
                onChange={(e) => setRequiereSeguimiento(e.target.checked)}
                className="h-4 w-4 mt-1"
              />
              <div>
                <Label htmlFor="seguimiento">Requiere visita de seguimiento</Label>
                <p className="text-sm text-muted-foreground">
                  Marque esta opción si se requiere una visita de seguimiento posterior
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Nota: La aplicación correcta de las recomendaciones es responsabilidad directa del Productor
              </p>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Nombre y firma de funcionario MAG</p>
                  <div className="h-10 w-40 border-b mt-6"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">Firma del Productor</p>
                  <div className="h-10 w-40 border-b mt-6"></div>
                </div>
              </div>
            </div>

            <div className="hidden">
              <button type="submit">Submit</button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t bg-muted/50">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={() => document.querySelector("form")?.requestSubmit()} disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
