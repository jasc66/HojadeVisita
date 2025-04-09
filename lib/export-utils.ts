// Función para convertir datos a CSV
export function generateCSV(data: any[], fields: Record<string, boolean>) {
  // Preparar los encabezados según los campos seleccionados
  const headers: string[] = []

  if (fields.consecutivo) headers.push("Consecutivo")
  if (fields.fecha) headers.push("Fecha")
  if (fields.tipoContacto) headers.push("Tipo de Contacto")
  if (fields.nombreProductor) headers.push("Nombre del Productor")
  if (fields.cedulaProductor) headers.push("Cédula")
  if (fields.telefonoProductor) headers.push("Teléfono del Productor")
  if (fields.correoProductor) headers.push("Correo del Productor")
  if (fields.region) headers.push("Región")
  if (fields.agencia) headers.push("Agencia")
  if (fields.funcionario) headers.push("Funcionario")
  if (fields.actividad) headers.push("Actividad")
  if (fields.areaAtendida) headers.push("Área Atendida")
  if (fields.medioAtencion) headers.push("Medio de Atención")
  if (fields.asuntoRecomendacion) headers.push("Asunto y Recomendación")
  if (fields.observacion) headers.push("Observación")
  if (fields.requiereSeguimiento) headers.push("Requiere Seguimiento")

  // Preparar las filas de datos
  const rows = data.map((item) => {
    const row: any[] = []

    if (fields.consecutivo) row.push(item.consecutivo || "")
    if (fields.fecha) row.push(formatDate(item.fecha) || "")
    if (fields.tipoContacto) row.push(item.tipoContacto || "")
    if (fields.nombreProductor) row.push(item.productor?.nombre || "")
    if (fields.cedulaProductor) row.push(item.productor?.cedula || "")
    if (fields.telefonoProductor) row.push(item.productor?.telefono || "")
    if (fields.correoProductor) row.push(item.productor?.correo || "")
    if (fields.region) row.push(item.agencia?.region?.nombre || "")
    if (fields.agencia) row.push(item.agencia?.nombre || "")
    if (fields.funcionario) row.push(item.funcionario?.nombre || "")
    if (fields.actividad) row.push(item.actividad || "")
    if (fields.areaAtendida) row.push(item.areaAtendida || "")
    if (fields.medioAtencion) row.push(`${item.medioAtencionTipo || ""} - ${item.medioAtencionSubtipo || ""}`)
    if (fields.asuntoRecomendacion) row.push(item.asuntoRecomendacion || "")
    if (fields.observacion) row.push(item.observacion || "")
    if (fields.requiereSeguimiento) row.push(item.requiereSeguimiento ? "Sí" : "No")

    return row
  })

  // Combinar encabezados y filas
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return csvContent
}

// Función para generar archivo Excel (versión simplificada sin dependencia externa)
export function generateExcel(data: any[], fields: Record<string, boolean>) {
  // Convertimos a CSV y luego lo transformamos a un formato que se pueda descargar
  const csvContent = generateCSV(data, fields)

  // En una implementación real, aquí usaríamos la biblioteca xlsx
  // Pero para evitar problemas de dependencias, devolvemos el CSV en formato de texto
  // que luego se descargará como .xlsx

  // Convertir el CSV a un ArrayBuffer (simulando un archivo Excel)
  const encoder = new TextEncoder()
  const excelBuffer = encoder.encode(csvContent).buffer

  return excelBuffer
}

// Función para formatear fechas
function formatDate(dateString: string) {
  if (!dateString) return ""

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Función para descargar un archivo
export function downloadFile(data: string | ArrayBuffer, filename: string, type: string) {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()

  // Limpiar
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}
