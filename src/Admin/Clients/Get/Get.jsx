export const validarCorreo = (correo) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
};

const URL = 'https://redgas.onrender.com/ClienteGet';

export const buscarClientePorCorreo = async (correoBusqueda) => {
  if (!correoBusqueda || correoBusqueda.trim() === '') {
    // Si está vacío, devolvemos null para que el componente muestre todo
    return null;
  }

  if (!validarCorreo(correoBusqueda)) {
    // Lanzamos error para que el componente pueda manejarlo
    throw new Error('Por favor, introduce un correo válido.');
  }

  const res = await fetch(`${URL}?correo_cliente=${encodeURIComponent(correoBusqueda)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('No se encontró un cliente con este correo.');
  }

  const data = await res.json();

  if (!data?.data) {
    throw new Error('No se encontró un cliente con este correo.');
  }

  return data.data;
};
