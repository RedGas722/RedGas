import React, { useState } from 'react';

export const UpdateModal = ({ onClose }) => {
  const [nombreServicio, setNombreServicio] = useState('');
  const [nuevoNombreServicio, setNuevoNombreServicio] = useState('');
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [precioServicio, setPrecioServicio] = useState('');
  const [mensaje, setMensaje] = useState('');

  const URL = 'http://localhost:10101/ServicioUpdate';

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log('Datos enviados:', {
      nombre_servicio: nombreServicio,
      nuevo_nombre_servicio: nuevoNombreServicio,
      descripcion_servicio: descripcionServicio,
      precio_servicio: precioServicio,
    });

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

        <input
          type="text"
          placeholder="Nombre del Servicio"
          value={nombreServicio}
          onChange={(e) => setNombreServicio(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Nuevo Nombre del Servicio"
          value={nuevoNombreServicio}
          onChange={(e) => setNuevoNombreServicio(e.target.value)}
          className="border rounded p-2"
        />
        <textarea
          placeholder="Descripción del Servicio"
          value={descripcionServicio}
          onChange={(e) => setDescripcionServicio(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Precio del Servicio"
          value={precioServicio}
          onChange={(e) => setPrecioServicio(e.target.value)}
          className="border rounded p-2"
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