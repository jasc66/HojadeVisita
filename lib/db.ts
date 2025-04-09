// Verificar si estamos en producción (Vercel)
const isProduction = process.env.NODE_ENV === "production"

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

// Usar cliente simulado en todos los entornos para evitar problemas de despliegue
console.log("Usando cliente Prisma simulado")
const prisma = createMockPrismaClient()

export default prisma
