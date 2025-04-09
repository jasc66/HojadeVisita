"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  consecutivo: z.string().optional(),
  tipoContacto: z.enum(["Contacto", "Ocasional"]),
  regionDesarrollo: z.string().min(1, "La región es requerida"),
  fecha: z.date(),
  agenciaExtension: z.string().min(1, "La agencia es requerida"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  funcionario: z.string().min(1, "El nombre del funcionario es requerido"),
  nombreProductor: z.string().min(1, "El nombre del productor es requerido"),
  cedulaProductor: z.string().min(9, "La cédula debe tener 9 dígitos"),
  telefonoProductor: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  correoProductor: z.string().email("Correo electrónico inválido").optional(),
  actividad: z.string().min(1, "La actividad es requerida"),
  areaAtendida: z.string().min(1, "El área atendida es requerida"),
  medioAtencion: z.object({
    tipo: z.enum(["Virtual", "Presencial"]),
    subtipo: z.string(),
  }),
  asuntoRecomendacion: z.string().min(1, "El asunto y recomendación son requeridos"),
  observacion: z.string().optional(),
  requiereSeguimiento: z.boolean(),
})

export default function NuevaAtencionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoContacto: "Contacto",
      fecha: new Date(),
      medioAtencion: {
        tipo: "Presencial",
        subtipo: "Oficina",
      },
      requiereSeguimiento: false,
    },
  })

  const medioAtencionTipo = form.watch("medioAtencion.tipo")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      // Simulamos el guardado de datos
      console.log(values)

      // Esperamos un segundo para simular la petición
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mostramos un mensaje de éxito
      toast({
        title: "Atención registrada",
        description: "La atención ha sido registrada correctamente.",
      })

      // Redireccionamos a la lista de atenciones
      router.push("/atenciones")
    } catch (error) {
      console.error("Error al guardar:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la atención.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
              <p className="text-sm font-medium">N° {form.watch("consecutivo") || "2023-006"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-between items-center">
                <FormField
                  control={form.control}
                  name="tipoContacto"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Tipo de contacto</FormLabel>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Contacto" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Contacto</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Ocasional" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Ocasional</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="regionDesarrollo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Región de Desarrollo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una región" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Central">Central</SelectItem>
                          <SelectItem value="Chorotega">Chorotega</SelectItem>
                          <SelectItem value="Pacífico Central">Pacífico Central</SelectItem>
                          <SelectItem value="Brunca">Brunca</SelectItem>
                          <SelectItem value="Huetar Atlántica">Huetar Atlántica</SelectItem>
                          <SelectItem value="Huetar Norte">Huetar Norte</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agenciaExtension"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agencia de Extensión Agropecuaria</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de la agencia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de la Agencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="funcionario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funcionario</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo del funcionario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-lg mb-4">Información del Productor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nombreProductor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Productor/a</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cedulaProductor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N° Cédula</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de cédula" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefonoProductor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="Teléfono del productor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="correoProductor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <Input placeholder="Correo electrónico" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="actividad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actividad/Rubro</FormLabel>
                        <FormControl>
                          <Input placeholder="Actividad o rubro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="areaAtendida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área Atendida</FormLabel>
                        <FormControl>
                          <Input placeholder="Área atendida" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-lg mb-4">Medio de atención</h3>
                <FormField
                  control={form.control}
                  name="medioAtencion.tipo"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Virtual" />
                            </FormControl>
                            <FormLabel className="font-medium">Virtual</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Presencial" />
                            </FormControl>
                            <FormLabel className="font-medium">Presencial</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-3 ml-7">
                  <FormField
                    control={form.control}
                    name="medioAtencion.subtipo"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una opción" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {medioAtencionTipo === "Virtual" ? (
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <FormField
                  control={form.control}
                  name="asuntoRecomendacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asunto atendido y Recomendación Técnica</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa el asunto atendido y la recomendación técnica brindada"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="observacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observación</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observaciones adicionales" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="requiereSeguimiento"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Requiere visita de seguimiento</FormLabel>
                        <FormDescription>
                          Marque esta opción si se requiere una visita de seguimiento posterior
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t bg-muted/50">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading} className="gap-2">
            {loading ? (
              "Guardando..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Guardar
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
