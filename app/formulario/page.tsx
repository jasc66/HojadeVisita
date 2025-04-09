"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { regiones, agencias } from "@/lib/data"

export default function FormularioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [tipoContacto, setTipoContacto] = useState("Contacto")
  const [regionId, setRegionId] = useState("")
  const [agenciaId, setAgenciaId] = useState("")
  const [medioAtencion, setMedioAtencion] = useState("Presencial")
  const [medioAtencionSubtipo, setMedioAtencionSubtipo] = useState("Oficina")
  const [requiereSeguimiento, setRequiereSeguimiento] = useState(false)
  const [agenciasFiltradas, setAgenciasFiltradas] = useState<typeof agencias>([])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, router, user])

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
    if (medioAtencion === "Virtual") {
      setMedioAtencionSubtipo("Teams")
    } else {
      setMedioAtencionSubtipo("Oficina")
    }
  }, [medioAtencion])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Obtener los datos del formulario
    const formData = new FormData(e.currentTarget)
    const data = {
      tipoContacto,
      fecha: formData.get("fecha") as string,
      funcionarioId: user?.id,
      agenciaId,
      nombreProductor: formData.get("nombreProductor") as string,
      cedulaProductor: formData.get("cedula") as string,
      telefonoProductor: formData.get("telefonoProductor") as string,
      correoProductor: formData.get("correo") as string,
      actividad: formData.get("actividad") as string,
      areaAtendida: formData.get("area") as string,
      medioAtencionTipo: medioAtencion,
      medioAtencionSubtipo: medioAtencionSubtipo,
      asuntoRecomendacion: formData.get("asunto") as string,
      observacion: formData.get("observacion") as string,
      requiereSeguimiento,
    }

    try {
      // Simulamos el guardado de datos
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Atención registrada",
        description: "La atención ha sido registrada correctamente.",
      })

      router.push("/atenciones")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la atención.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-10 text-center">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-green-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>SERVICIO DE EXTENSIÓN AGROPECUARIA</CardTitle>
              <CardDescription className="text-lg font-medium mt-1">ATENCIÓN A PERSONAS PRODUCTORAS</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">N° 2023-006</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Label>Tipo de contacto</Label>
                <RadioGroup defaultValue={tipoContacto} onValueChange={setTipoContacto} className="flex space-x-4">
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
                <Input id="fecha" name="fecha" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
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
                  <Input id="nombreProductor" name="nombreProductor" placeholder="Nombre completo" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cedula">N° Cédula</Label>
                  <Input id="cedula" name="cedula" placeholder="Número de cédula" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefonoProductor">Teléfono</Label>
                  <Input
                    id="telefonoProductor"
                    name="telefonoProductor"
                    placeholder="Teléfono del productor"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correo">Correo</Label>
                  <Input id="correo" name="correo" placeholder="Correo electrónico" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actividad">Actividad/Rubro</Label>
                  <Input id="actividad" name="actividad" placeholder="Actividad o rubro" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Área Atendida</Label>
                  <Input id="area" name="area" placeholder="Área atendida" required />
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
                <Label htmlFor="asunto">Asunto atendido y Recomendación Técnica</Label>
                <Textarea
                  id="asunto"
                  name="asunto"
                  placeholder="Describa el asunto atendido y la recomendación técnica brindada"
                  className="min-h-[150px]"
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
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
