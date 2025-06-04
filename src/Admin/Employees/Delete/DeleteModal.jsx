import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

const DELETE_URL = 'https://redgas.onrender.com/EmpleadoDelete';
const GET_URL = 'https://redgas.onrender.com/EmpleadoGet';

export const DeleteModal = ({ onClose, setRefrescar }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.trim()) return 'El correo es obligatorio';
    if (!regex.test(correo)) return 'Formato de correo inválido';
    return '';
  };

  const verificarExistenciaEmpleado = async (correo) => {
    try {
      const res = await fetch(`${GET_URL}?correo_empleado=${encodeURIComponent(correo)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Error al verificar existencia del empleado');
      }

      const data = await res.json();
      if (!data?.data || data.data.length === 0) {
        setMensaje('No se encontró un empleado con este correo');
        return false;
      }
      return true;
    } catch (err) {
      setMensaje('Error al verificar existencia: ' + err.message);
      return false;
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setMensaje('');
    const errorValidacion = validarCorreo(correo);

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setError('');

    const empleadoExiste = await verificarExistenciaEmpleado(correo);
    if (!empleadoExiste) return;

    try {
      const res = await fetch(`${DELETE_URL}?correo_empleado=${encodeURIComponent(correo)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Empleado no encontrado o error en la solicitud');

      setMensaje('Eliminación exitosa');
      setRefrescar(true);
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message);
    }
  };

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

        <h2 className="text-xl font-bold text-center">Eliminación de empleado</h2>

        <Inputs Type='2' Place='Correo del Empleado' Value={correo} onChange={(e) => setCorreo(e.target.value)} />
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
