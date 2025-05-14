import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs'

const URL = 'http://localhost:10101/ClienteDelete';
const GET_URL = 'http://localhost:10101/ClienteGet'; // Endpoint para verificar si el cliente existe

export const DeleteModal = ({ onClose }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Función de validación del correo
  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.trim()) return 'El correo es obligatorio';
    if (!regex.test(correo)) return 'Formato de correo inválido';
    return '';
  };

  // Función para verificar si el cliente existe en la base de datos
  const verificarExistenciaCliente = async (correo) => {
    try {
      const res = await fetch(`${GET_URL}?correo_cliente=${encodeURIComponent(correo)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Error al verificar existencia del cliente');
      }

      const data = await res.json();
      // Si no se encuentra el cliente
      if (data?.data?.length === 0) {
        setMensaje('No se encontró un cliente con este correo');
        return false;
      }
      return true; // El cliente existe
    } catch (err) {
      setMensaje('Error al verificar existencia: ' + err.message);
      return false;
    }
  };

  // Función para manejar la eliminación del cliente
  const handleDelete = async (e) => {
    e.preventDefault();
    setMensaje('');
    const errorValidacion = validarCorreo(correo);

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setError('');

    // Verificar si el cliente existe
    const clienteExiste = await verificarExistenciaCliente(correo);
    if (!clienteExiste) {
      return; // No se procede con la eliminación si no existe el cliente
    }

    // Proceder con la eliminación del cliente
    try {
      console.log('Eliminando...');
      const res = await fetch(`${URL}?correo_cliente=${encodeURIComponent(correo)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Cliente no encontrado o error en la solicitud');
      setMensaje('Eliminación exitosa');
      console.log('Completado!');
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message);
    }
  };

  // Función para cancelar la operación y limpiar el estado
  const handleCancel = () => {
    setCorreo('');
    setMensaje('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-2xl p-6 shadow-lg w-[300px] flex flex-col gap-4 text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Eliminación de cliente</h2>

        <Inputs Type='2' Place='Correo del Cliente' Value={correo} onChange={(e) => setCorreo(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}

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
          <p className={`text-center font-semibold ${mensaje.includes('exitosa') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
