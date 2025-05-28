import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';
import CardServicesGetBack from './CardServicesGetBack';

export const GetModal = ({ onClose, onResult }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const URL = 'http://localhost:10101/ServicioGet';

  const handleGet = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setMensaje({ error: 'Por favor, ingrese un nombre válido.' });
      if (onResult) onResult([]);
      return;
    }

    try {
      const res = await fetch(`${URL}?nombre_servicio=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Error al consultar el servicio');
      const data = await res.json();
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        setMensaje({ ...data });
        if (onResult) onResult(data.data);
      } else {
        setMensaje({ data: [] });
        if (onResult) onResult([]);
      }
    } catch (err) {
      setMensaje({ error: 'Error al consultar: ' + err.message });
      if (onResult) onResult([]);
    }
  };

  const handleCancel = () => {
    setNombre('');
    setMensaje(null);
    if (onResult) onResult([]);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Servicio</h2>

        <Inputs
          Type="1"
          Place="Nombre del servicio"
          Value={nombre}
          onChange={(e) => setNombre(e.target.value)}
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

        {mensaje && mensaje.error && (
          <div className="bg-red-100 p-3 rounded mt-2 text-sm text-red-700">
            {mensaje.error}
          </div>
        )}
        {mensaje && mensaje.data && mensaje.data.length > 0 && (
          <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <CardServicesGetBack servicio={mensaje.data[0]} />
          </div>
        )}
        {mensaje && mensaje.data && mensaje.data.length === 0 && (
          <div className="bg-yellow-100 p-3 rounded mt-2 text-sm text-yellow-700">
            No se encontró el servicio solicitado.
          </div>
        )}
      </div>
    </div>
  );
};
