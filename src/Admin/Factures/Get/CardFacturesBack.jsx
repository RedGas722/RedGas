const CardFacturesBack = ({ factura, clientes, empleados, onUpdateClick, onViewProductsClick }) => {
  const cliente = clientes.find(c => c.id_cliente === factura.id_cliente);
  const empleado = empleados.find(e => e.id_empleado === factura.id_empleado);

  const fechaISO = factura.fecha_factura;
  const fecha = new Date(fechaISO);
  const fechaSolo = fecha.toLocaleDateString('en-GB');

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 min-w-[300px] min-h-[150px] flex flex-col justify-between overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 truncate">Factura #{factura.id_factura}</h2>

        <div className="mt-2 space-y-1 text-sm">
          <p><span className="font-semibold">Cliente:</span> {cliente?.nombre_cliente || 'Desconocido'}</p>
          <p><span className="font-semibold">Empleado:</span> {empleado?.nombre_empleado || 'Desconocido'}</p>
          <p><span className="font-semibold">Fecha:</span> {fechaSolo}</p>
          <p><span className="font-semibold">Estado:</span> {factura.estado_factura}</p>
          <p><span className="font-semibold">Total:</span> ${factura.total}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={() => onUpdateClick(factura)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
        >
          Actualizar Estado
        </button>
        <button
          onClick={() => onViewProductsClick(factura)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          Ver Productos
        </button>
      </div>
    </div>
  );
};

export default CardFacturesBack;
