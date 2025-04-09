// Datos de ejemplo para la aplicación

// Usuarios
export const usuarios = [
  {
    id: "1",
    nombre: "Admin Sistema",
    email: "admin@sistema.com",
    password: "admin123",
    rol: "admin",
    agenciaId: "1",
  },
  {
    id: "2",
    nombre: "Juan Pérez",
    email: "juan@mag.go.cr",
    password: "juan123",
    rol: "funcionario",
    agenciaId: "1",
  },
  {
    id: "3",
    nombre: "María Rodríguez",
    email: "maria@mag.go.cr",
    password: "maria123",
    rol: "funcionario",
    agenciaId: "2",
  },
  {
    id: "4",
    nombre: "Carlos Vega",
    email: "carlos@mag.go.cr",
    password: "carlos123",
    rol: "consulta",
    agenciaId: "3",
  },
]

// Regiones
export const regiones = [
  { id: "1", nombre: "Central" },
  { id: "2", nombre: "Chorotega" },
  { id: "3", nombre: "Pacífico Central" },
  { id: "4", nombre: "Brunca" },
  { id: "5", nombre: "Huetar Atlántica" },
  { id: "6", nombre: "Huetar Norte" },
]

// Agencias
export const agencias = [
  { id: "1", nombre: "San José", telefono: "2222-1111", regionId: "1" },
  { id: "2", nombre: "Alajuela", telefono: "2222-2222", regionId: "1" },
  { id: "3", nombre: "Liberia", telefono: "2222-3333", regionId: "2" },
  { id: "4", nombre: "Puntarenas", telefono: "2222-4444", regionId: "3" },
  { id: "5", nombre: "San Isidro", telefono: "2222-5555", regionId: "4" },
  { id: "6", nombre: "Limón", telefono: "2222-6666", regionId: "5" },
  { id: "7", nombre: "San Carlos", telefono: "2222-7777", regionId: "6" },
]

// Productores
export const productores = [
  {
    id: "1",
    cedula: "101230456",
    nombre: "Juan Pérez Rodríguez",
    telefono: "8888-1111",
    correo: "juan.productor@email.com",
  },
  {
    id: "2",
    cedula: "203450678",
    nombre: "María González Sánchez",
    telefono: "8888-2222",
    correo: "maria.productora@email.com",
  },
  {
    id: "3",
    cedula: "304560789",
    nombre: "Carlos Jiménez Vargas",
    telefono: "8888-3333",
    correo: "carlos.productor@email.com",
  },
  {
    id: "4",
    cedula: "405670891",
    nombre: "Ana Ramírez Castro",
    telefono: "8888-4444",
    correo: "ana.productora@email.com",
  },
  {
    id: "5",
    cedula: "506780912",
    nombre: "Roberto Méndez Solís",
    telefono: "8888-5555",
    correo: "roberto.productor@email.com",
  },
]

// Atenciones
export let atenciones = [
  {
    id: "1",
    consecutivo: "2023-001",
    tipoContacto: "Contacto",
    fecha: "2023-04-15",
    funcionarioId: "2",
    agenciaId: "1",
    productorId: "1",
    actividad: "Café",
    areaAtendida: "Cultivo",
    medioAtencionTipo: "Presencial",
    medioAtencionSubtipo: "Oficina",
    asuntoRecomendacion: "Consulta sobre manejo de plagas en café. Se recomendó aplicación de control biológico.",
    observacion: "El productor implementará las recomendaciones en la próxima semana.",
    requiereSeguimiento: true,
  },
  {
    id: "2",
    consecutivo: "2023-002",
    tipoContacto: "Ocasional",
    fecha: "2023-04-20",
    funcionarioId: "3",
    agenciaId: "2",
    productorId: "2",
    actividad: "Ganadería",
    areaAtendida: "Nutrición animal",
    medioAtencionTipo: "Virtual",
    medioAtencionSubtipo: "Teams",
    asuntoRecomendacion:
      "Asesoría sobre mejora de pastos para ganado lechero. Se recomendó implementación de sistema silvopastoril.",
    observacion: "",
    requiereSeguimiento: false,
  },
  {
    id: "3",
    consecutivo: "2023-003",
    tipoContacto: "Contacto",
    fecha: "2023-04-25",
    funcionarioId: "2",
    agenciaId: "1",
    productorId: "3",
    actividad: "Hortalizas",
    areaAtendida: "Riego",
    medioAtencionTipo: "Presencial",
    medioAtencionSubtipo: "Finca",
    asuntoRecomendacion:
      "Evaluación de sistema de riego por goteo. Se recomendó ajustes en la presión y frecuencia de riego.",
    observacion: "Se programó visita de seguimiento para verificar implementación.",
    requiereSeguimiento: true,
  },
  {
    id: "4",
    consecutivo: "2023-004",
    tipoContacto: "Ocasional",
    fecha: "2023-05-02",
    funcionarioId: "3",
    agenciaId: "2",
    productorId: "4",
    actividad: "Frutales",
    areaAtendida: "Poscosecha",
    medioAtencionTipo: "Virtual",
    medioAtencionSubtipo: "Telefónico",
    asuntoRecomendacion:
      "Consulta sobre manejo poscosecha de aguacate. Se brindaron recomendaciones sobre empaque y almacenamiento.",
    observacion: "",
    requiereSeguimiento: false,
  },
  {
    id: "5",
    consecutivo: "2023-005",
    tipoContacto: "Contacto",
    fecha: "2023-05-10",
    funcionarioId: "2",
    agenciaId: "1",
    productorId: "5",
    actividad: "Apicultura",
    areaAtendida: "Sanidad",
    medioAtencionTipo: "Presencial",
    medioAtencionSubtipo: "Finca",
    asuntoRecomendacion:
      "Revisión de colmenas con problemas sanitarios. Se recomendó tratamiento orgánico para control de varroa.",
    observacion: "El productor aplicará el tratamiento de inmediato.",
    requiereSeguimiento: true,
  },
]

// Función para agregar una nueva atención
export function agregarAtencion(nuevaAtencion: any) {
  // Generar ID único
  const id = (atenciones.length + 1).toString()

  // Generar consecutivo
  const year = new Date().getFullYear()
  const consecutivo = `${year}-${(atenciones.length + 1).toString().padStart(3, "0")}`

  // Agregar la nueva atención
  const atencionCompleta = {
    id,
    consecutivo,
    ...nuevaAtencion,
  }

  atenciones = [...atenciones, atencionCompleta]
  return atencionCompleta
}

// Función para obtener una atención por ID
export function obtenerAtencionPorId(id: string) {
  return atenciones.find((atencion) => atencion.id === id)
}

// Función para obtener un productor por cédula
export function obtenerProductorPorCedula(cedula: string) {
  return productores.find((productor) => productor.cedula === cedula)
}

// Función para obtener un productor por ID
export function obtenerProductorPorId(id: string) {
  return productores.find((productor) => productor.id === id)
}

// Función para obtener una agencia por ID
export function obtenerAgenciaPorId(id: string) {
  return agencias.find((agencia) => agencia.id === id)
}

// Función para obtener una región por ID
export function obtenerRegionPorId(id: string) {
  return regiones.find((region) => region.id === id)
}

// Función para obtener un usuario por ID
export function obtenerUsuarioPorId(id: string) {
  return usuarios.find((usuario) => usuario.id === id)
}

// Función para obtener atenciones con información completa
export function obtenerAtencionesCompletas() {
  return atenciones.map((atencion) => {
    const funcionario = obtenerUsuarioPorId(atencion.funcionarioId)
    const productor = obtenerProductorPorId(atencion.productorId)
    const agencia = obtenerAgenciaPorId(atencion.agenciaId)
    const region = agencia ? obtenerRegionPorId(agencia.regionId) : null

    return {
      ...atencion,
      funcionario: funcionario
        ? {
            id: funcionario.id,
            nombre: funcionario.nombre,
            email: funcionario.email,
          }
        : null,
      productor,
      agencia,
      region,
    }
  })
}

// Estadísticas para el dashboard
export function obtenerEstadisticas() {
  const totalAtenciones = atenciones.length

  // Contar productores únicos
  const productoresUnicos = new Set(atenciones.map((a) => a.productorId)).size

  // Contar atenciones con seguimiento
  const atencionesConSeguimiento = atenciones.filter((a) => a.requiereSeguimiento).length

  // Contar atenciones presenciales
  const atencionesPresenciales = atenciones.filter((a) => a.medioAtencionTipo === "Presencial").length

  // Atenciones por región
  const atencionesRegion = regiones.map((region) => {
    const agenciasRegion = agencias.filter((a) => a.regionId === region.id).map((a) => a.id)
    const cantidad = atenciones.filter((a) => agenciasRegion.includes(a.agenciaId)).length
    return { name: region.nombre, value: cantidad }
  })

  // Atenciones por actividad
  const actividadesUnicas = [...new Set(atenciones.map((a) => a.actividad))]
  const atencionesActividad = actividadesUnicas.map((actividad) => {
    const cantidad = atenciones.filter((a) => a.actividad === actividad).length
    return { name: actividad, value: cantidad }
  })

  // Atenciones por medio
  const atencionesPresencialesOficina = atenciones.filter(
    (a) => a.medioAtencionTipo === "Presencial" && a.medioAtencionSubtipo === "Oficina",
  ).length
  const atencionesPresencialesFinca = atenciones.filter(
    (a) => a.medioAtencionTipo === "Presencial" && a.medioAtencionSubtipo === "Finca",
  ).length
  const atencionesVirtualesTeams = atenciones.filter(
    (a) => a.medioAtencionTipo === "Virtual" && a.medioAtencionSubtipo === "Teams",
  ).length
  const atencionesVirtualesTelefono = atenciones.filter(
    (a) => a.medioAtencionTipo === "Virtual" && a.medioAtencionSubtipo === "Telefónico",
  ).length
  const atencionesVirtualesCorreo = atenciones.filter(
    (a) => a.medioAtencionTipo === "Virtual" && a.medioAtencionSubtipo === "Correo",
  ).length

  const atencionesMediaAtencion = [
    { name: "Presencial - Oficina", value: atencionesPresencialesOficina },
    { name: "Presencial - Finca", value: atencionesPresencialesFinca },
    { name: "Virtual - Teams", value: atencionesVirtualesTeams },
    { name: "Virtual - Telefónico", value: atencionesVirtualesTelefono },
    { name: "Virtual - Correo", value: atencionesVirtualesCorreo },
  ]

  // Atenciones por seguimiento
  const atencionesSeguimiento = [
    { name: "Con seguimiento", value: atencionesConSeguimiento },
    { name: "Sin seguimiento", value: totalAtenciones - atencionesConSeguimiento },
  ]

  return {
    totalAtenciones,
    productoresUnicos,
    atencionesConSeguimiento,
    atencionesPresenciales,
    atencionesRegion,
    atencionesActividad,
    atencionesMediaAtencion,
    atencionesSeguimiento,
  }
}
