import React, { useState } from 'react';
import {Inputs } from '../../UI/Inputs/Inputs'

export const GetModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const URL = 'http://localhost:10101/CategoriaGet';

  const handleGet = async (e) => {
    e.preventDefault();
    try {
      console.log('Consultando...');
      const res = await fetch(`${URL}?nombre_categoria=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
        setMensaje(data);
        console.log('Completado!');
    } catch (err) {
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setNombre('');
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Categoria</h2>
        <Inputs Type='1' Place='Nombre de la categoria' Value={nombre} onChange={(e) => setNombre(e.target.value)} />

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
            <p><strong>ID:</strong> {mensaje.data[0].id_categoria}</p>
            <p><strong>Nombre:</strong> {mensaje.data[0].nombre_categoria}</p>
        </div>
        )}
      </div>
    </div>
  );
};
