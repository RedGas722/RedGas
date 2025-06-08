const URL = 'https://redgas.onrender.com/CategoriaGet';

export const buscarCategoriaPorNombre = async (nombreBusqueda) => {
  if (!nombreBusqueda || nombreBusqueda.trim() === '') {
    // Si está vacío, devolvemos null para que el componente muestre todo
    return null;
  }

  const res = await fetch(`${URL}?nombre_categoria=${encodeURIComponent(nombreBusqueda)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('No se encontró una categoria con este nombre.');
  }

  const data = await res.json();

  if (!data?.data) {
    throw new Error('No se encontró una categoria con este nombre.');
  }

  return data.data;
};
