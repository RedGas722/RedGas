import React, { useState } from 'react';

export const GetModal = ({ onClose }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const URL = 'http://localhost:10101/AdminGet';

  const handleGet = async (e) => {
    e.preventDefault();
    try {
      console.log(`Fetching: ${URL}?correo_admin=${encodeURIComponent(correo)}`); // Log the GET request
      const res = await fetch(`${URL}?correo_admin=${encodeURIComponent(correo)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      console.log('Response:', data); // Log the response
      setMensaje(data);
    } catch (err) {
      console.error('Error:', err.message); // Log the error
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

        <h2 className="text-xl font-bold text-center">Consultar Administrador</h2>

        <input
          type="email"
          placeholder="Correo del administrador"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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
            <p><strong>Nombre:</strong> {mensaje.data[0].nombre_admin}</p>
            <p><strong>Correo:</strong> {mensaje.data[0].correo_admin}</p>
            <p><strong>Teléfono:</strong> {mensaje.data[0].telefono_admin}</p>
        </div>
        )}
      </div>
    </div>
  );
};
