"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { obtenerEstadisticas } from "@/lib/data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { useAuth } from "@/lib/auth-context"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [estadisticas, setEstadisticas] = useState<any>(null)

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Cargar estadísticas
  useEffect(() => {
    if (user) {
      const data = obtenerEstadisticas()
      setEstadisticas(data)
    }
  }, [user])

  if (isLoading || !estadisticas) {
    return <div className="container mx-auto py-10 text-center">Cargando...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Atenciones</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Atenciones</CardTitle>
            <CardDescription>Año actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalAtenciones}</div>
            <p className="text-xs text-muted-foreground">+15% respecto al año anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productores Atendidos</CardTitle>
            <CardDescription>Año actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.productoresUnicos}</div>
            <p className="text-xs text-muted-foreground">+8% respecto al año anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Atenciones con Seguimiento</CardTitle>
            <CardDescription>Año actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.atencionesConSeguimiento}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((estadisticas.atencionesConSeguimiento / estadisticas.totalAtenciones) * 100)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Atenciones Presenciales</CardTitle>
            <CardDescription>Año actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.atencionesPresenciales}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((estadisticas.atencionesPresenciales / estadisticas.totalAtenciones) * 100)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="region" className="space-y-4">
        <TabsList>
          <TabsTrigger value="region">Por Región</TabsTrigger>
          <TabsTrigger value="actividad">Por Actividad</TabsTrigger>
          <TabsTrigger value="medio">Por Medio de Atención</TabsTrigger>
          <TabsTrigger value="seguimiento">Por Seguimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="region" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atenciones por Región</CardTitle>
              <CardDescription>Distribución de atenciones por región de desarrollo</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={estadisticas.atencionesRegion}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22c55e" label={{ position: "top" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actividad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atenciones por Actividad</CardTitle>
              <CardDescription>Distribución de atenciones por actividad o rubro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estadisticas.atencionesActividad}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {estadisticas.atencionesActividad.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atenciones por Medio</CardTitle>
              <CardDescription>Distribución de atenciones por medio de atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estadisticas.atencionesMediaAtencion}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {estadisticas.atencionesMediaAtencion.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguimiento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atenciones por Seguimiento</CardTitle>
              <CardDescription>Distribución de atenciones que requieren seguimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estadisticas.atencionesSeguimiento}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {estadisticas.atencionesSeguimiento.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
