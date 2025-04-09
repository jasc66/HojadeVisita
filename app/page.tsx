import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, ClipboardList, BarChart3, Users } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Sistema de Gestión de Atención a Productores</h1>
        <p className="text-xl text-muted-foreground mt-2">Servicio de Extensión Agropecuaria</p>
        <p className="mt-2 text-green-600">Bienvenido, {session.user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Registrar Atención
            </CardTitle>
            <CardDescription>Crear un nuevo registro de atención a productores</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/formulario">
              <Button className="w-full">
                Crear Registro <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estadísticas
            </CardTitle>
            <CardDescription>Ver reportes y estadísticas de atenciones</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full" variant="outline">
                Ver Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Atenciones
            </CardTitle>
            <CardDescription>Ver listado de atenciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/atenciones">
              <Button className="w-full" variant="outline">
                Ver Atenciones <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
