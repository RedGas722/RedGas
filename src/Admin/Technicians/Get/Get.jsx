const URL = 'https://redgas.onrender.com/TecnicoGet'

export const buscarTecnicoPorCorreo = async (correoTecnico) => {
  if (!correoTecnico || correoTecnico.trim() === '') {
    return null // Si el input está vacío, el componente puede cargar todos
  }

  const res = await fetch(`${URL}?correo_tecnico=${encodeURIComponent(correoTecnico)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('No se encontró un técnico con este correo.')
  }

  const data = await res.json()
  return data?.data ? [data.data] : []
}
