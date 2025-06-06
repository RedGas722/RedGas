export const DeleteEmployee = async (correo_empleado) => {
  const URL = 'https://redgas.onrender.com/EmpleadoDelete';

  try {
    const res = await fetch(`${URL}?correo_empleado=${encodeURIComponent(correo_empleado)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Error al eliminar el empleado');
    }

    return { success: true, message: 'Empleado eliminado con éxito' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};