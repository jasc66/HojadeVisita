import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { usuarios } from "@/lib/data"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = usuarios.find((user) => user.email === credentials.email)

        if (!user) {
          return null
        }

        // Para simplificar, comparamos directamente las contraseñas
        // En producción, usaríamos bcrypt.compare
        const passwordMatch = user.password === credentials.password

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          name: user.nombre,
          email: user.email,
          role: user.rol,
          agenciaId: user.agenciaId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.agenciaId = user.agenciaId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role as string
        session.user.agenciaId = token.agenciaId as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "tu-secreto-seguro-aqui", // En producción, usar una variable de entorno
}
