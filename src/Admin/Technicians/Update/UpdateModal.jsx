import React, { useState } from 'react';

export const UpdateModal = ({ onClose }) => {
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [imagen, setImagen] = useState(null);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');

  const URL = 'http://localhost:10101/TecnicoUpdate';

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!imagen) {
      setMensaje('Por favor, seleccione una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_tecnico', nombre);
    formData.append('nuevo_correo_tecnico', nuevoCorreo);
    formData.append('contrasena_tecnico', contrasena);
    formData.append('telefono_tecnico', telefono);
    formData.append('imagen', imagen);
    formData.append('correo_tecnico', correo);
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
    setNuevoCorreo('');
    setNombre('');
    setImagen(null);
    setMensaje('');
    setCorreo('');
    setTelefono('');
    setContrasena('');
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

        <h2 className="text-xl font-bold text-center">Actualizar Tecnico</h2>

        <input
          type="text"
          placeholder="Correo Actual del Técnico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Nuevo Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="email"
          placeholder="Nuevo Correo del Técnico"
          value={nuevoCorreo}
          onChange={(e) => setNuevoCorreo(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Nuevo Teléfono del Técnico"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="password"
          placeholder="Nueva Contraseña del Técnico"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
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
