const CardFacturesBack = ({ factura, clientes, empleados, onUpdateClick }) => {
  const cliente = clientes.find(c => c.id_cliente === factura.id_cliente);
  const empleado = empleados.find(e => e.id_empleado === factura.id_empleado);

  // Formateo de fecha
  const fechaISO = factura.fecha_factura;
  const fecha = new Date(fechaISO);
  const fechaSolo = fecha.toLocaleDateString('en-GB');

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 min-w-[300px] min-h-[150px] flex flex-col justify-between overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 truncate">Factura #{factura.id_factura}</h2>

        <div className="mt-2 space-y-1 text-sm">
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Cliente:</span>
            <span className="break-words">{cliente?.nombre_cliente || 'Desconocido'}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Empleado:</span>
            <span className="break-words">{empleado?.nombre_empleado || 'Desconocido'}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Fecha:</span>
            <span className="break-words">{fechaSolo}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Estado:</span>
            <span className="break-words">{factura.estado_factura}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Total:</span>
            <span className="break-words">${factura.total}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex">
        <button
          onClick={() => onUpdateClick(factura)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
        >
          Actualizar Estado
        </button>
      </div>
    </div>
  );
};

export default CardFacturesBack;
