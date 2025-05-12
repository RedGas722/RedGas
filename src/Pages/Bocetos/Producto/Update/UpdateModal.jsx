import React, { useState } from 'react';

export const UpdateModal = ({ onClose }) => {
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nombreActual, setNombreActual] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const URL = 'http://localhost:10101/ProductoUpdate';

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!imagen) {
      setMensaje('Por favor, seleccione una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('nuevo_nombre_producto', nuevoNombre);
    formData.append('nombre_producto', nombreActual);
    formData.append('precio_producto', parseFloat(precio));
    formData.append('descripcion_producto', descripcion);
    formData.append('stock', parseInt(stock));
    formData.append('imagen', imagen);

    try {
      const res = await fetch(URL, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al actualizar el producto');
      await res.json();
      setMensaje('Actualización exitosa');
    } catch (err) {
      console.error('Error al actualizar:', err);
      setMensaje('Error al actualizar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setNuevoNombre('');
    setNombreActual('');
    setPrecio('');
    setDescripcion('');
    setStock('');
    setImagen(null);
    setMensaje('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagen(file);
  };


  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Actualizar Producto</h2>

        <input
          type="text"
          placeholder="Nombre Actual del Producto"
          value={nombreActual}
          onChange={(e) => setNombreActual(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Nuevo Nombre"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="border rounded p-2"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="file"
          onChange={handleImageChange}
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
