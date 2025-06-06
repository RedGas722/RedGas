export const DeleteAdmin = async (correo_admin) => {
  const URL = 'http://localhost:10101/AdminDelete';

  try {
    const res = await fetch(`${URL}?correo_admin=${encodeURIComponent(correo_admin)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Error al eliminar administrador');
    }

    return { success: true, message: 'Administrador eliminado con éxito' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};