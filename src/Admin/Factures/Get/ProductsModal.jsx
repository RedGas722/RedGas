import { useEffect, useState } from 'react'

const convertirBase64AUrl = (imagen) => {
  if (!imagen) {
    console.warn("No hay imagen")
    return null
  }
  if (typeof imagen === 'string') {
    return `data:image/png;base64,${imagen}`
  }
  if (typeof imagen === 'object' && imagen.type === 'Buffer' && Array.isArray(imagen.data)) {
    const byteArray = new Uint8Array(imagen.data)
    const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    const base64String = btoa(binaryString)
    return `data:image/png;base64,${base64String}`
  }
  console.warn("Formato de imagen desconocido:", imagen)
  return null
}

export const ProductsModal = ({ factura, onClose }) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const resPedidos = await fetch(`https://redgas.onrender.com/PedidoProductoGet?id_factura=${factura.id_factura}`)
        const pedidosData = await resPedidos.json()

        const pedidos = pedidosData.data || []

        const productosCompletos = await Promise.all(pedidos.map(async (pedido) => {
          const resProducto = await fetch(`https://redgas.onrender.com/ProductoGetById?id_producto=${pedido.id_producto}`)
          const productoData = await resProducto.json()

          return {
            ...pedido,
            nombre_producto: productoData.data.nombre_producto,
            precio_producto: productoData.data.precio_producto,
            descripcion_producto: productoData.data.descripcion_producto,
            imagen: productoData.data.imagen
          }
        }))

        setProductos(productosCompletos)
      } catch (error) {
        console.error('Error al obtener productos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [factura])

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-transparent backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Productos de la Factura #{factura.id_factura}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando productos...</p>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {productos.map((producto, index) => {
              const imageUrl = convertirBase64AUrl(producto.imagen);

              const precioConDescuento = producto.precio_producto * (1 - (producto.descuento || 0) / 100);
              const precioRedondeado = Math.round(precioConDescuento / 50) * 50;

              return (
                <div key={index} className="border p-4 rounded-lg shadow-md">
                  <p className="font-semibold text-lg text-gray-800 mb-2">{producto.nombre_producto}</p>

                  {imageUrl ? (
                    <img src={imageUrl} alt={producto.nombre_producto} className="w-full h-[200px] object-contain rounded mb-3" />
                  ) : (
                    <div className="w-full h-[200px] flex justify-center items-center bg-gray-200 rounded text-gray-500 mb-3">
                      Imagen no disponible
                    </div>
                  )}

                  <p className="text-sm"><strong>Descripción:</strong> {producto.descripcion_producto}</p>
                  <p className="text-sm"><strong>Cantidad:</strong> {producto.cantidad_producto}</p>
                  <p className="text-sm">
                    <strong>Precio Unitario:</strong> {
                      new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(precioRedondeado)
                    }
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay productos asociados.</p>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
