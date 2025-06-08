export const DeleteClient = async (correo_cliente) => {
  const URL = 'https://redgas.onrender.com/ClienteDelete';

  try {
    const res = await fetch(`${URL}?correo_cliente=${encodeURIComponent(correo_cliente)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Error al eliminar cliente');
    }

    return { success: true, message: 'Cliente eliminado con éxito' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};