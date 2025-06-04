import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

const URL = 'http://localhost:10101/AdminDelete';

export const DeleteModal = ({ onClose, setRefrescar }) => {
  const [correoAdmin, setCorreoAdmin] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    // Validación frontend: correo obligatorio y formato
    if (!correoAdmin.trim()) {
      setMensaje('Por favor, ingrese el correo del administrador.');
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(correoAdmin)) {
      setMensaje('Por favor, ingrese un correo válido.');
      return;
    }
    try {
      const res = await fetch(`${URL}?correo_admin=${encodeURIComponent(correoAdmin)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        // No se pudo extraer el mensaje del backend
      }
      if (!res.ok) {
        if (data?.message === 'Correo no encontrado') {
          setMensaje('El correo no se encuentra registrado.');
        } else if (data?.message === 'delete ok') {
          setMensaje('Eliminación exitosa');
        } else {
          setMensaje(data?.message || 'Error desconocido');
        }
        return;
      }
      if (data?.message === 'delete ok') {
        setMensaje('Eliminación exitosa');
        if (setRefrescar) setRefrescar(true);
      } else if (data?.message === 'Correo no encontrado') {
        setMensaje('El correo no se encuentra registrado.');
      } else {
        setMensaje('Eliminación exitosa'); // Si no hay error y no hay mensaje, asume éxito
        if (setRefrescar) setRefrescar(true);
      }
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setCorreoAdmin('');
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-2xl p-6 shadow-lg w-[300px] flex flex-col gap-4">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Eliminación de Administrador</h2>

        <Inputs
          Type="2"
          Place="Correo del Administrador..."
          Value={correoAdmin}
          onChange={(e) => setCorreoAdmin(e.target.value)}
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