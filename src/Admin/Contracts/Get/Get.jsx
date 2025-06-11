import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const GetModal = ({ onClose }) => {
  const [idEmpleado, setIdEmpleado] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const URL = 'http://localhost:10101/ContratoGet';

  const handleGet = async (e) => {
    e.preventDefault();
    try {
      if (!idEmpleado || idEmpleado.trim() === '' || isNaN(idEmpleado)) {
        setMensaje({ error: 'Por favor, introduce un ID de empleado válido.' });
        return;
      }

      const res = await fetch(`${URL}?id_empleado=${encodeURIComponent(idEmpleado)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('No se encontró contrato para este empleado');
      const data = await res.json();
      console.log('Respuesta del backend:', data); // <-- Depuración
      setMensaje(data);
    } catch (err) {
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setIdEmpleado('');
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Contrato</h2>

        <Inputs
          Type="1"
          Place="ID del empleado"
          Value={idEmpleado}
          onChange={(e) => setIdEmpleado(e.target.value)}
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

        {mensaje && mensaje.error && (
          <div className="bg-red-100 p-3 rounded mt-2 text-sm text-red-700">
            {mensaje.error}
          </div>
        )}
        {mensaje && mensaje.data && Array.isArray(mensaje.data) && mensaje.data.length > 0 && (
          <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>ID Contrato:</strong> {mensaje.data[0].id_contrato}</p>
            <p><strong>Fecha:</strong> {mensaje.data[0].fecha_contrato}</p>
            <p><strong>Duración:</strong> {mensaje.data[0].duracion_contrato}</p>
            <p><strong>Tipo:</strong> {mensaje.data[0].tipo_contrato}</p>
            <p><strong>Salario:</strong> {mensaje.data[0].salario}</p>
            <p><strong>ID Admin:</strong> {mensaje.data[0].id_admin}</p>
            <p><strong>ID Empleado:</strong> {mensaje.data[0].id_empleado}</p>
          </div>
        )}
        {mensaje && mensaje.data && Array.isArray(mensaje.data) && mensaje.data.length === 0 && (
          <div className="bg-yellow-100 p-3 rounded mt-2 text-sm text-yellow-700">
            No se encontró contrato para este empleado.
          </div>
        )}
      </div>
    </div>
  );
};
