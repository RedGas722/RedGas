const URL = 'https://redgas.onrender.com/ServicioGet'

export const buscarServicioPorNombre = async (nombreServicio) => {
  if (!nombreServicio || nombreServicio.trim() === '') {
    return null // Si está vacío, el componente puede volver a cargar todos los servicios
  }

  const res = await fetch(`${URL}?nombre_servicio=${encodeURIComponent(nombreServicio)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('No se encontró un servicio con este nombre.')
  }

  const data = await res.json()

  return Array.isArray(data.data) ? data.data : []
}
