export const DeleteContract = async (id_empleado) => {
  const URL = 'https://redgas.onrender.com/ContratoDelete';

  try {
    // Validar que el campo exista y sea numérico
    if (!id_empleado || isNaN(id_empleado)) {
      return { success: false, message: 'Falta el ID de empleado para eliminar el contrato.' };
    }
    const res = await fetch(`${URL}?id_empleado=${encodeURIComponent(id_empleado)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Error al eliminar contrato');
    }

    return { success: true, message: 'Contrato(s) eliminado(s) con éxito' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};