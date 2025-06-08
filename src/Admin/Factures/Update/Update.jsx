import { useState, useEffect } from 'react';

export const UpdateModal = ({ onClose, setRefrescar, facturaCarta }) => {
  const [estadoFactura, setEstadoFactura] = useState('inactiva');
  const [IDfactura, setIDfactura] = useState('');
  const [mensaje, setMensaje] = useState('');

  const URL = 'https://redgas.onrender.com/FacturaUpdate';

  useEffect(() => {
      if (facturaCarta) {  
          setIDfactura(facturaCarta.id_factura);
          setEstadoFactura(facturaCarta.estado_factura);
      }
    }, [facturaCarta]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_factura: IDfactura,
          estado_factura: estadoFactura
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar la factura.');
      const data = await res.json();
      setMensaje('Actualización exitosa.');
      if (setRefrescar) setRefrescar(true);  // Esto indica que se debe refrescar los datos
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message);
    }
  };

  const cancelarEdicion = () => {
    setEstadoFactura('inactiva');
    setIDfactura('');
    setMensaje('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Actualizar Factura</h2>
        <select
          value={estadoFactura}
          onChange={(e) => setEstadoFactura(e.target.value)}
          className="border rounded p-2"
        >
          <option value="activa">Activa</option>
          <option value="inactiva">Inactiva</option>
        </select>

        <div className="flex justify-between gap-2">
          <button
            onClick={cancelarEdicion}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >Actualizar</button>
        </div>

        {mensaje && (
          <p className={`text-center font-semibold text-sm mt-2 ${mensaje.startsWith('Error') || mensaje.startsWith('No se') ? 'text-red-600' : 'text-green-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
