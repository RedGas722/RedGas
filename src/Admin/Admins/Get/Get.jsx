export const validarCorreo = (correo) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(correo)
}

const URL = 'https://redgas.onrender.com/AdminGet'

export const buscarAdminPorCorreo = async (correoBusqueda) => {
  if (!correoBusqueda || correoBusqueda.trim() === '') {
    return null
  }

  if (!validarCorreo(correoBusqueda)) {
    throw new Error('Por favor, introduce un correo válido.')
  }

  const res = await fetch(`${URL}?correo_admin=${encodeURIComponent(correoBusqueda)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('No se encontró un administrador con este correo.')
  }

  const data = await res.json()

  if (!data?.data) {
    throw new Error('No se encontró un administrador con este correo.')
  }

  return data.data
}
