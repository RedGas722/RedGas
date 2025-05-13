import React, { useState } from 'react';

const URL = 'http://localhost:10101/EmpleadoDelete';

export const DeleteModal = ({ onClose }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      console.log('Eliminando...');
      const res = await fetch(`${URL}?correo_empleado=${encodeURIComponent(correo)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      

      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      setMensaje('Eliminación exitosa');
      console.log('Completado!');
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setCorreo('');
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-2xl p-6 shadow-lg w-[300px] flex flex-col gap-4">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Eliminación de empleado</h2>

        <input
          type="text"
          placeholder="Email Empleado..."
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
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Confirmar</button>
        </div>

        {mensaje && (<p className="text-center text-green-600 font-semibold">{mensaje}</p>)}

      </div>
    </div>
  );
};
