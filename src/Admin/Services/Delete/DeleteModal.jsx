export const DeleteService = async (nombre_servicio) => {
  const URL = 'https://redgas.onrender.com/ServicioDelete';

  try {
    const res = await fetch(`${URL}?nombre_servicio=${encodeURIComponent(nombre_servicio)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Error al eliminar servicio');
    }

    return { success: true, message: 'Servicio eliminado con éxito' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
