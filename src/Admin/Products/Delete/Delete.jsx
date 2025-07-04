export const DeleteProduct = async (nombre_producto) => {
  const URL = 'https://redgas.onrender.com/ProductoDelete'

  try {
    const res = await fetch(`${URL}?nombre_producto=${encodeURIComponent(nombre_producto)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Error al eliminar producto')
    }

    return { success: true, message: 'Producto eliminado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}
