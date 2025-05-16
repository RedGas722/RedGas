import React, { useState } from 'react';

const URL = 'http://localhost:10101/ContratoDelete';

export const DeleteModal = ({ onClose }) => {
  const [idEmpleado, setIdEmpleado] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!idEmpleado || isNaN(idEmpleado)) {
      setMensaje('Por favor ingresa un ID de empleado válido.');
      return;
    }
    try {
      setMensaje('Eliminando...');
      const res = await fetch(`${URL}?id_empleado=${encodeURIComponent(idEmpleado)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        let errorMsg = 'Error al eliminar el contrato';
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
        } catch {
          // intentionally empty
        }
        throw new Error(errorMsg);
      }
      setMensaje('Eliminación exitosa');
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setIdEmpleado('');
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-2xl p-6 shadow-lg w-[300px] flex flex-col gap-4">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Eliminación de contrato</h2>

        <input
          type="number"
          placeholder="ID del empleado..."
          value={idEmpleado}
          onChange={(e) => setIdEmpleado(e.target.value)}
          className="border rounded p-2"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Confirmar</button>
        </div>

        {mensaje && (
          <p className={`text-center font-semibold ${mensaje.toLowerCase().includes('éxito') ? 'text-green-600' : mensaje.toLowerCase().includes('error') ? 'text-red-600' : 'text-gray-700'}`}>{mensaje}</p>
        )}

      </div>
    </div>
  );
};
