"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { useToast } from "@/components/ui/use-toast"
import { FileDown, Filter, Database } from "lucide-react"
import { regiones, obtenerAtencionesCompletas } from "@/lib/data"
// Importar las utilidades de exportación
import { generateCSV, generateExcel, downloadFile } from "@/lib/export-utils"

export default function ExportarPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [exportType, setExportType] = useState("csv")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [regionFilter, setRegionFilter] = useState("")
  const [selectedFields, setSelectedFields] = useState({
    // Datos básicos
    consecutivo: true,
    fecha: true,
    tipoContacto: true,
    // Productor
    nombreProductor: true,
    cedulaProductor: true,
    telefonoProductor: true,
    correoProductor: false,
    // Ubicación
    region: true,
    agencia: true,
    // Atención
    funcionario: true,
    actividad: true,
    areaAtendida: true,
    medioAtencion: true,
    asuntoRecomendacion: false,
    observacion: false,
    requiereSeguimiento: true,
  })

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Función para exportar datos
  const handleExport = async () => {
    setLoading(true)
    try {
      // Obtener los datos (usando la función simulada para este ejemplo)
      const atenciones = obtenerAtencionesCompletas()

      // Aplicar filtros si es necesario
      let filteredData = [...atenciones]

      // Filtrar por región
      if (regionFilter && regionFilter !== "all") {
        filteredData = filteredData.filter((atencion) => atencion.region?.id === regionFilter)
      }

      // Filtrar por fecha
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from)
        filteredData = filteredData.filter((atencion) => new Date(atencion.fecha) >= fromDate)
      }

      if (dateRange.to) {
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999) // Final del día
        filteredData = filteredData.filter((atencion) => new Date(atencion.fecha) <= toDate)
      }

      // Contamos cuántos campos se han seleccionado
      const selectedCount = Object.values(selectedFields).filter(Boolean).length

      // Generar el archivo según el formato seleccionado
      if (exportType === "csv") {
        const csvContent = generateCSV(filteredData, selectedFields)
        downloadFile(csvContent, `atenciones_${new Date().toISOString().split("T")[0]}.csv`, "text/csv")
      } else if (exportType === "excel") {
        const excelBuffer = generateExcel(filteredData, selectedFields)
        downloadFile(
          excelBuffer,
          `atenciones_${new Date().toISOString().split("T")[0]}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
      } else if (exportType === "pdf") {
        // Para PDF se podría implementar con una librería como jsPDF
        // Por ahora mostramos un mensaje
        toast({
          title: "Exportación a PDF",
          description: "La exportación a PDF estará disponible próximamente.",
        })
        setLoading(false)
        return
      }

      toast({
        title: "Exportación completada",
        description: `Se ha generado un archivo ${exportType.toUpperCase()} con ${selectedCount} columnas de datos.`,
      })
    } catch (error) {
      console.error("Error en la exportación:", error)
      toast({
        title: "Error en la exportación",
        description: "No se pudo completar la exportación. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = (section: string, value: boolean) => {
    if (section === "basic") {
      setSelectedFields({
        ...selectedFields,
        consecutivo: value,
        fecha: value,
        tipoContacto: value,
      })
    } else if (section === "productor") {
      setSelectedFields({
        ...selectedFields,
        nombreProductor: value,
        cedulaProductor: value,
        telefonoProductor: value,
        correoProductor: value,
      })
    } else if (section === "ubicacion") {
      setSelectedFields({
        ...selectedFields,
        region: value,
        agencia: value,
      })
    } else if (section === "atencion") {
      setSelectedFields({
        ...selectedFields,
        funcionario: value,
        actividad: value,
        areaAtendida: value,
        medioAtencion: value,
        asuntoRecomendacion: value,
        observacion: value,
        requiereSeguimiento: value,
      })
    } else if (section === "all") {
      const newState = Object.fromEntries(Object.keys(selectedFields).map((key) => [key, value]))
      setSelectedFields(newState)
    }
  }

  if (status === "loading") {
    return <div className="container mx-auto py-10 text-center">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileDown className="h-6 w-6" /> Exportar Datos
          </CardTitle>
          <CardDescription>
            Seleccione los campos y filtros para exportar la información de atenciones a productores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fields" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields" className="flex items-center gap-2">
                <Database className="h-4 w-4" /> Campos a exportar
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtros
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="space-y-6 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Selección de campos</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleSelectAll("all", true)}>
                    Seleccionar todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleSelectAll("all", false)}>
                    Deseleccionar todos
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Datos básicos */}
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Datos básicos</h4>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleSelectAll("basic", true)}>
                        Todos
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleSelectAll("basic", false)}>
                        Ninguno
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consecutivo"
                        checked={selectedFields.consecutivo}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, consecutivo: checked as boolean })
                        }
                      />
                      <Label htmlFor="consecutivo">Consecutivo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fecha"
                        checked={selectedFields.fecha}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, fecha: checked as boolean })
                        }
                      />
                      <Label htmlFor="fecha">Fecha</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tipoContacto"
                        checked={selectedFields.tipoContacto}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, tipoContacto: checked as boolean })
                        }
                      />
                      <Label htmlFor="tipoContacto">Tipo de contacto</Label>
                    </div>
                  </div>
                </div>

                {/* Datos del productor */}
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Datos del productor</h4>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleSelectAll("productor", true)}>
                        Todos
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleSelectAll("productor", false)}>
                        Ninguno
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nombreProductor"
                        checked={selectedFields.nombreProductor}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, nombreProductor: checked as boolean })
                        }
                      />
                      <Label htmlFor="nombreProductor">Nombre del productor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cedulaProductor"
                        checked={selectedFields.cedulaProductor}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, cedulaProductor: checked as boolean })
                        }
                      />
                      <Label htmlFor="cedulaProductor">Cédula</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="telefonoProductor"
                        checked={selectedFields.telefonoProductor}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, telefonoProductor: checked as boolean })
                        }
                      />
                      <Label htmlFor="telefonoProductor">Teléfono</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="correoProductor"
                        checked={selectedFields.correoProductor}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, correoProductor: checked as boolean })
                        }
                      />
                      <Label htmlFor="correoProductor">Correo electrónico</Label>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Ubicación</h4>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleSelectAll("ubicacion", true)}>
                        Todos
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleSelectAll("ubicacion", false)}>
                        Ninguno
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="region"
                        checked={selectedFields.region}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, region: checked as boolean })
                        }
                      />
                      <Label htmlFor="region">Región</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agencia"
                        checked={selectedFields.agencia}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, agencia: checked as boolean })
                        }
                      />
                      <Label htmlFor="agencia">Agencia</Label>
                    </div>
                  </div>
                </div>

                {/* Datos de la atención */}
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Datos de la atención</h4>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleSelectAll("atencion", true)}>
                        Todos
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleSelectAll("atencion", false)}>
                        Ninguno
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="funcionario"
                        checked={selectedFields.funcionario}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, funcionario: checked as boolean })
                        }
                      />
                      <Label htmlFor="funcionario">Funcionario</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="actividad"
                        checked={selectedFields.actividad}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, actividad: checked as boolean })
                        }
                      />
                      <Label htmlFor="actividad">Actividad/Rubro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="areaAtendida"
                        checked={selectedFields.areaAtendida}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, areaAtendida: checked as boolean })
                        }
                      />
                      <Label htmlFor="areaAtendida">Área atendida</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medioAtencion"
                        checked={selectedFields.medioAtencion}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, medioAtencion: checked as boolean })
                        }
                      />
                      <Label htmlFor="medioAtencion">Medio de atención</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="asuntoRecomendacion"
                        checked={selectedFields.asuntoRecomendacion}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, asuntoRecomendacion: checked as boolean })
                        }
                      />
                      <Label htmlFor="asuntoRecomendacion">Asunto y recomendación</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="observacion"
                        checked={selectedFields.observacion}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, observacion: checked as boolean })
                        }
                      />
                      <Label htmlFor="observacion">Observación</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requiereSeguimiento"
                        checked={selectedFields.requiereSeguimiento}
                        onCheckedChange={(checked) =>
                          setSelectedFields({ ...selectedFields, requiereSeguimiento: checked as boolean })
                        }
                      />
                      <Label htmlFor="requiereSeguimiento">Requiere seguimiento</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-6 pt-4">
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-4">Filtros de exportación</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Rango de fechas</Label>
                      <div className="flex items-center gap-2">
                        <DatePicker
                          date={dateRange.from}
                          setDate={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                          placeholder="Fecha inicial"
                        />
                        <span>a</span>
                        <DatePicker
                          date={dateRange.to}
                          setDate={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                          placeholder="Fecha final"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region-filter">Región</Label>
                      <Select value={regionFilter} onValueChange={setRegionFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las regiones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las regiones</SelectItem>
                          {regiones.map((region) => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-4">Formato de exportación</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="csv"
                        value="csv"
                        checked={exportType === "csv"}
                        onChange={() => setExportType("csv")}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="csv">CSV</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="excel"
                        value="excel"
                        checked={exportType === "excel"}
                        onChange={() => setExportType("excel")}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="excel">Excel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="pdf"
                        value="pdf"
                        checked={exportType === "pdf"}
                        onChange={() => setExportType("pdf")}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="pdf">PDF</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={loading} className="flex items-center gap-2">
            {loading ? (
              "Exportando..."
            ) : (
              <>
                <FileDown className="h-4 w-4" /> Exportar datos
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
