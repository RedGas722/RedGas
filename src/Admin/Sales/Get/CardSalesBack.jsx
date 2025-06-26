const CardSalesBack = ({ venta, productos }) => {
  const producto = productos.find(p => p.id_producto === venta.id_producto)

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 min-w-[300px] min-h-[150px] flex flex-col justify-between overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 truncate">Pedido #{venta.id_pedidoProducto}</h2>

        <div className="mt-2 space-y-1 text-sm">
          <p><span className="font-semibold">Producto:</span> {producto?.nombre_producto || 'Desconocido'}</p>
          <p><span className="font-semibold">Factura:</span> #{venta.id_factura}</p>
          <p><span className="font-semibold">Cantidad:</span> {venta.cantidad_producto}</p>
          <p><span className="font-semibold">Estado:</span> {venta.estado_pedido}</p>
        </div>
      </div>
    </div>
  )
}

export default CardSalesBack