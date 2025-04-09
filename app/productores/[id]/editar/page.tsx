"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { obtenerProductorPorId } from "@/lib/data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"

export default function EditarProductorPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    correo: "",
  })

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Cargar datos del productor
  useEffect(() => {
    if (status === "authenticated" && params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      const productor = obtenerProductorPorId(id)

      if (!productor) {
        setError("No se encontró el productor solicitado")
        setLoadingData(false)
        return
      }

      setFormData({
        nombre: productor.nombre,
        cedula: productor.cedula,
        telefono: productor.telefono,
        correo: productor.correo || "",
      })

      setLoadingData(false)
    }
  }, [status, params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        title: "Productor actualizado",
        description: "Los datos del productor han sido actualizados correctamente.",
      })

      router.push(`/productores/${params.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar los datos del productor.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
          <Button onClick={() => router.push("/productores")}>Volver a Productores</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" onClick={() => router.back()} className="mb-6 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Productor</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="editar-productor-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cedula">Número de cédula</Label>
                  <Input id="cedula" name="cedula" value={formData.cedula} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleInputChange}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" form="editar-productor-form" disabled={loading} className="flex items-center gap-2">
            {loading ? (
              "Guardando..."
            ) : (
              <>
                <Save className="h-4 w-4" /> Guardar cambios
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
