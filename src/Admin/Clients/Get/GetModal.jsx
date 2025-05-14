import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs'

export const GetModal = ({ onClose }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState('');

  const URL = 'http://localhost:10101/ClienteGet'; // URL de la API

  // Función para validar que el correo tenga el formato correcto
  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  // Función para verificar si el correo existe en la base de datos
  const verificarCorreoExistente = async (correo) => {
    try {
      const res = await fetch(`${URL}?correo_cliente=${encodeURIComponent(correo)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setMensaje({ error: 'No se encontró un cliente con este correo.' });
        return false;
      }

      const data = await res.json();
      if (data?.data?.length > 0) {
        setMensaje(data);
        return true;
      } else {
        setMensaje({ error: 'No se encontró un cliente con este correo.' });
        return false;
      }
    } catch (err) {
      setMensaje({ error: 'Error al consultar: ' + err.message });
      return false;
    }
  };

  const handleGet = async (e) => {
    e.preventDefault();

    // Verificar si el correo está vacío o tiene un formato incorrecto
    if (!correo.trim()) {
      setError('El campo de correo no puede estar vacío.');
      setMensaje(null);
      return;
    }

    if (!validarCorreo(correo)) {
      setError('Por favor, introduce un correo válido.');
      setMensaje(null);
      return;
    }

    // Limpiar errores y mensajes previos
    setError('');
    setMensaje(null);

    // Verificar si el correo existe en la base de datos
    await verificarCorreoExistente(correo);
  };

  const handleCancel = () => {
    setCorreo('');
    setMensaje(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Cliente</h2>

        <Inputs Type='2' Place='Correo del Cliente' Value={correo} onChange={(e) => setCorreo(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}

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

        {/* Mostrar mensaje de error o datos del cliente */}
        {mensaje?.error && (
          <p className="text-red-600 text-sm text-center">{mensaje.error}</p>
        )}

        {mensaje?.data?.length > 0 && (
          <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>Nombre:</strong> {mensaje.data[0].nombre_cliente}</p>
            <p><strong>Correo:</strong> {mensaje.data[0].correo_cliente}</p>
            <p><strong>Teléfono:</strong> {mensaje.data[0].telefono_cliente}</p>
            <p><strong>Dirección:</strong> {mensaje.data[0].direccion_cliente || 'Sin dirección'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
