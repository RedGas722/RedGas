import React, { useState } from 'react';

export const GetModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const URL = 'http://localhost:10101/ServicioGet';

  const handleGet = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setMensaje({ error: 'Por favor, ingrese un nombre válido.' });
      return;
    }

    try {
      const res = await fetch(`${URL}?nombre_servicio=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Error al consultar el servicio');
      const data = await res.json();
      if (data.data) {
        setMensaje({ ...data });
      }
    } catch (err) {
      console.error(err);
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setNombre('');
    setMensaje(null);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Servicio</h2>

        <input
          type="text"
          placeholder="Nombre del servicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleGet}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >Consultar</button>
        </div>

        {mensaje && mensaje.data && (
          <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>Nombre:</strong> {mensaje.data[0].nombre_servicio }</p>
            <p><strong>Descripción:</strong> {mensaje.data[0].descripcion_servicio}</p>
            <p><strong>Precio:</strong> {mensaje.data[0].precio_servicio}</p>
          </div>
        )}
      </div>
    </div>
  );
};
