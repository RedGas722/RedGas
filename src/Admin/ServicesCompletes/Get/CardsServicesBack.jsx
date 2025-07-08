const CardServicesBack = ({ servicio, clientes }) => {
  const cliente = clientes.find(c => c.id_cliente === servicio.id_cliente)

  return (
    <div className="z-[2] NeoContainer_outset_TL p-4 min-w-[300px] min-h-[150px] flex flex-col justify-between overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 truncate">Servicio #{servicio.id_pedidoServicio}</h2>

        <div className="mt-2 space-y-1 text-sm">
          <p><span className="font-semibold">Cliente:</span> {cliente?.correo_cliente || 'Desconocido'}</p>
          <p><span className="font-semibold">Técnico:</span> #{servicio.id_tecnico}</p>
          <p><span className="font-semibold">Total:</span> ${servicio.total}</p>
          <p><span className="font-semibold">Descripción:</span> {servicio.descripcion}</p>
          <p><span className="font-semibold">Estado:</span> {servicio.estado_pedido}</p>
        </div>
      </div>
    </div>
  )
}

export default CardServicesBack
