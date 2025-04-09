import { PrismaClient } from "@prisma/client"

// Verificar si estamos en producción (Vercel)
const isProduction = process.env.NODE_ENV === "production" && process.env.VERCEL === "1"

// Crear un cliente simulado para entornos de producción sin base de datos
const createMockPrismaClient = () => {
  return {
    atencion: {
      findMany: async () => [],
      findUnique: async () => null,
      findFirst: async () => null,
      create: async (data: any) => data.data,
      update: async (data: any) => data.data,
      delete: async () => ({}),
      count: async () => 0,
    },
    productor: {
      findMany: async () => [],
      findUnique: async () => null,
      findFirst: async () => null,
      create: async (data: any) => data.data,
      update: async (data: any) => data.data,
      delete: async () => ({}),
    },
    agencia: {
      findMany: async () => [],
    },
    region: {
      findMany: async () => [],
    },
    usuario: {
      findMany: async () => [],
      findUnique: async () => null,
    },
    $connect: async () => {},
    $disconnect: async () => {},
  }
}

// Usar cliente real o simulado según el entorno
let prisma: any

if (isProduction) {
  console.log("Usando cliente Prisma simulado en producción")
  prisma = createMockPrismaClient()
} else {
  // En desarrollo, usar el cliente real
  const globalForPrisma = global as unknown as { prisma: PrismaClient }
  prisma = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
}

export default prisma
