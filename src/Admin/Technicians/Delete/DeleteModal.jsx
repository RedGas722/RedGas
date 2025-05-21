import React, { useState } from 'react';
import Inputs from '../../UI/Inputs/Inputs';

const URL = 'http://localhost:10101/TecnicoDelete';

export const DeleteModal = ({ onClose }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos
    return regex.test(correo);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!correo.trim()) {
      setMensaje('Por favor, ingrese un correo.');
      return;
    }

    if (!validarCorreo(correo)) {
      setMensaje('Por favor, ingrese un correo válido.');
      return;
    }

    try {
      console.log('Eliminando...');
      const res = await fetch(`${URL}?correo_tecnico=${encodeURIComponent(correo)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.message === 'Correo no encontrado') {
          setMensaje('El correo no se encuentra registrado.');
          return;
        }
        setMensaje('Error al eliminar: ' + (errorData.message || 'Error desconocido del servidor'));
        return;
      }

      const data = await res.json();
      if (data && typeof data.message === 'string' && data.message === 'Correo no encontrado') {
        setMensaje('El correo no se encuentra registrado.');
        return;
      }
      setMensaje('Eliminación exitosa');
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

        <h2 className="text-xl font-bold text-center">Eliminación de Tecnico</h2>

        <Inputs
          Type="1"
          Place="Correo Tecnico..."
          Value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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
          <p className={`text-center ${mensaje.includes('Error') ? 'text-red-600' : 'text-green-600'} font-semibold`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
