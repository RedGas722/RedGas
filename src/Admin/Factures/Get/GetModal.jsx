import React, { useState } from 'react';

export const GetModal = ({ onClose }) => {
  const [IDfactura, setIDfactura] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const URL = 'http://localhost:10101/FacturaGet';

  const handleGet = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}?id_factura=${encodeURIComponent(IDfactura)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      console.log('Respuesta de la API:', data);
        setMensaje(data);
    } catch (err) {
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setCorreo('');
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Cliente</h2>

        <input
          type="number"
          placeholder="ID de la factura"
          value={IDfactura}
          onChange={(e) => setIDfactura(e.target.value)}
          className="border rounded p-2"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleGet}
            className="bg-blue-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Consultar</button>
        </div>

        {mensaje && mensaje.data && mensaje.data.length > 0 && (
        <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>id_factura:</strong> {mensaje.data[0].id_factura}</p>
            <p><strong>id_cliente:</strong> {mensaje.data[0].id_cliente}</p>
            <p><strong>id_empleado:</strong> {mensaje.data[0].id_empleado}</p>
            <p><strong>fecha_factura:</strong> {mensaje.data[0].fecha_factura}</p>
            <p><strong>estado_factura:</strong> {mensaje.data[0].estado_factura}</p>
            <p><strong>total:</strong> {mensaje.data[0].total}</p>
        </div>
        )}
      </div>
    </div>
  );
};
