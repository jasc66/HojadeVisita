/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para ignorar errores de TypeScript durante la compilación
  typescript: {
    // !! ADVERTENCIA !!
    // Ignorar errores de TypeScript es peligroso en producción
    // Esta opción solo debe usarse para solucionar problemas temporales
    ignoreBuildErrors: true,
  },
  // Configuración para ignorar errores de ESLint durante la compilación
  eslint: {
    // !! ADVERTENCIA !!
    // Ignorar errores de ESLint es peligroso en producción
    // Esta opción solo debe usarse para solucionar problemas temporales
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
