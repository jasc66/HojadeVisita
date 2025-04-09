"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usuarios } from "@/lib/data"

// Definir el tipo de usuario
type User = {
  id: string
  nombre: string
  email: string
  rol: string
  agenciaId?: string
}

// Definir el tipo del contexto de autenticación
type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Función de inicio de sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    // Buscar usuario por email
    const foundUser = usuarios.find((u) => u.email === email)

    // Verificar si existe y la contraseña coincide
    if (foundUser && foundUser.password === password) {
      // Crear objeto de usuario sin la contraseña
      const userInfo = {
        id: foundUser.id,
        nombre: foundUser.nombre,
        email: foundUser.email,
        rol: foundUser.rol,
        agenciaId: foundUser.agenciaId,
      }

      // Guardar en estado y localStorage
      setUser(userInfo)
      localStorage.setItem("user", JSON.stringify(userInfo))
      return true
    }

    return false
  }

  // Función de cierre de sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// Componente para proteger rutas
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="container mx-auto py-10 text-center">Cargando...</div>
  }

  return user ? <>{children}</> : null
}
