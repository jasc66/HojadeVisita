"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TreesIcon, BarChart3, ClipboardList, Users, LogIn, LogOut, FileDown } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // No mostrar la barra de navegación en la página de login
  if (pathname === "/login") {
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <TreesIcon className="h-6 w-6 text-green-600" />
            <span className="hidden font-bold sm:inline-block">Sistema Agropecuario</span>
          </Link>
          {session && (
            <nav className="flex items-center space-x-4 lg:space-x-6">
              <Link
                href="/atenciones"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  pathname.startsWith("/atenciones") ? "text-primary" : "text-muted-foreground",
                )}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                <span>Atenciones</span>
              </Link>
              <Link
                href="/productores"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  pathname.startsWith("/productores") ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Productores</span>
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
                )}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/exportar"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  pathname === "/exportar" ? "text-primary" : "text-muted-foreground",
                )}
              >
                <FileDown className="mr-2 h-4 w-4" />
                <span>Exportar</span>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Button variant="destructive" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
