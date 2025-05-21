import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose }) => {
  const [nombreServicio, setNombreServicio] = useState('');
  const [nuevoNombreServicio, setNuevoNombreServicio] = useState('');
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [precioServicio, setPrecioServicio] = useState('');
  const [mensaje, setMensaje] = useState('');

  const URL = 'http://localhost:10101/ServicioUpdate';

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Validaciones de frontend
    if (!nombreServicio.trim()) {
      setMensaje('Por favor, ingrese el nombre actual del servicio.');
      return;
    }
    if (!nuevoNombreServicio.trim()) {
      setMensaje('Por favor, ingrese el nuevo nombre del servicio.');
      return;
    }
    if (!descripcionServicio.trim()) {
      setMensaje('Por favor, ingrese la descripción del servicio.');
      return;
    }
    if (!precioServicio || isNaN(precioServicio) || parseFloat(precioServicio) <= 0) {
      setMensaje('Por favor, ingrese un precio válido (mayor a 0).');
      return;
    }
    try {
      const res = await fetch(URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_servicio: nombreServicio,
          nuevo_nombre_servicio: nuevoNombreServicio,
          descripcion_servicio: descripcionServicio,
          precio_servicio: precioServicio,
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar el servicio');
      await res.json();
      setMensaje('Actualización exitosa');
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setNombreServicio('');
    setNuevoNombreServicio('');
    setDescripcionServicio('');
    setPrecioServicio('');
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Actualizar Servicio</h2>

        <Inputs
          Type="1"
          Place="Nombre del Servicio"
          Value={nombreServicio}
          onChange={(e) => setNombreServicio(e.target.value)}
        />
        <Inputs
          Type="1"
          Place="Nuevo Nombre del Servicio"
          Value={nuevoNombreServicio}
          onChange={(e) => setNuevoNombreServicio(e.target.value)}
        />
        <textarea
          placeholder="Descripción del Servicio"
          value={descripcionServicio}
          onChange={(e) => setDescripcionServicio(e.target.value)}
          className="border rounded p-2"
        />
        <Inputs
          Type="5"
          Place="Precio del Servicio"
          Value={precioServicio}
          onChange={(e) => setPrecioServicio(e.target.value)}
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >Actualizar</button>
        </div>

        {mensaje && (
          <p className="text-center text-green-600 font-semibold">{mensaje}</p>
        )}
      </div>
    </div>
  );
};