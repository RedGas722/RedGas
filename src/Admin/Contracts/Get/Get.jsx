const URL = 'https://redgas.onrender.com/ContratoGet'

export const buscarContratoPorEmpleado = async (idEmpleado) => {
  if (!idEmpleado) {
    return null
  }

  const res = await fetch(`${URL}?id_empleado=${encodeURIComponent(idEmpleado)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('No se encontró un contrato con este ID de empleado.')
  }

  const data = await res.json()

  if (!data?.data) {
    throw new Error('No se encontró un contrato con este ID de empleado.')
  }

  return data.data
}