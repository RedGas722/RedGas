const CardSalesBack = ({ venta, productos }) => {
  const producto = productos.find(p => p.id_producto === venta.id_producto)

  return (
    <div className="z-[2] NeoContainer_outset_TL p-4 min-w-[300px] min-h-[150px] flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-[var(--main-color)] truncate">Pedido #{venta.id_pedidoProducto}</h2>

        <div className="space text-sm text-[var(--main-color)]">
          <p><span className="font-semibold">Producto:</span> {producto?.nombre_producto || 'Desconocido'}</p>
          <p><span className="font-semibold">Factura:</span> # {venta.id_factura}</p>
          <p><span className="font-semibold">Cantidad:</span> {venta.cantidad_producto}</p>
          <p><span className="font-semibold">Estado:</span> {venta.estado_pedido.split('//')[0]}</p>
        </div>
      </div>
    </div>
  )
}

export default CardSalesBack