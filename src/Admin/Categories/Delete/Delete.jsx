export const DeleteCategory = async (nombre_categoria) => {
  const URL = 'https://redgas.onrender.com/CategoriaDelete';

  try {
    const res = await fetch(`${URL}?nombre_categoria=${encodeURIComponent(nombre_categoria)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Error al eliminar categoria');
    }

    return { success: true, message: 'Categoria eliminado con éxito' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};