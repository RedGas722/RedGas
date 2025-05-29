import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

const URL = 'https://redgas.onrender.com/ServicioDelete';
const GET_URL = 'https://redgas.onrender.com/ServicioGet'; // Endpoint para verificar si el servicio existe

export const DeleteModal = ({ onClose, setRefrescar }) => {
  const [nombreServicio, setNombreServicio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Validación del nombre del servicio
  const validarNombre = (nombre) => {
    if (!nombre.trim()) return 'El nombre del servicio es obligatorio';
    return '';
  };

  // Verificar si el servicio existe en la base de datos
  const verificarExistenciaServicio = async (nombre) => {
    try {
      const res = await fetch(`${GET_URL}?nombre_servicio=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error('Error al verificar existencia del servicio');
      }
      const data = await res.json();
      if (!data?.data || data?.data?.length === 0) {
        setMensaje('No se encontró un servicio con este nombre');
        return false;
      }
      return true;
    } catch (err) {
      setMensaje('Error al verificar existencia: ' + err.message);
      return false;
    }
  };

  // Manejar la eliminación del servicio
  const handleDelete = async (e) => {
    e.preventDefault();
    setMensaje('');
    const errorValidacion = validarNombre(nombreServicio);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }
    setError('');
    // Verificar si el servicio existe
    const servicioExiste = await verificarExistenciaServicio(nombreServicio);
    if (!servicioExiste) {
      return;
    }
    // Proceder con la eliminación
    try {
      const res = await fetch(`${URL}?nombre_servicio=${encodeURIComponent(nombreServicio)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        // Intentionally ignore JSON parse errors
      }
      if (!res.ok) {
        setMensaje(data?.status === 'not found' || data?.status === 'Servicio no encontrado'
          ? 'No se encontró un servicio con este nombre'
          : (data?.status || 'Error desconocido'));
        return;
      }
      if (data?.status === 'delete ok') {
        setMensaje('Eliminación exitosa');
        if (typeof setRefrescar === 'function') setRefrescar(true);
      } else if (data?.status === 'not found' || data?.status === 'Servicio no encontrado') {
        setMensaje('No se encontró un servicio con este nombre');
      } else {
        setMensaje(data?.status || 'Error desconocido');
      }
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message);
    }
  };

  // Cancelar y limpiar
  const handleCancel = () => {
    setNombreServicio('');
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

        <h2 className="text-xl font-bold text-center">Eliminación de servicio</h2>

        <Inputs Type='1' Place='Nombre del Servicio' Value={nombreServicio} onChange={(e) => setNombreServicio(e.target.value)} />
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