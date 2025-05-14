import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const GetModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [imagenURL, setImagenURL] = useState(null);
  const [errores, setErrores] = useState({});

  const URL = 'http://localhost:10101/ProductoGet';

  const validarCampos = () => {
    const errores = {};

    if (!nombre.trim()) {
      errores.nombre = 'El nombre del producto es obligatorio.';
    } else if (/^\d+$/.test(nombre)) {
      errores.nombre = 'El nombre no puede ser solo números.';
    }

    return errores;
  };

  const handleGet = async (e) => {
    e.preventDefault();

    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setMensaje(null);
      return;
    }

    setErrores({});
    try {
      console.log('Consultando...');
      const res = await fetch(`${URL}?nombre_producto=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.errors?.[0]?.msg || 'Error al consultar el producto.';
        setMensaje({ error: errorMsg });
        setImagenURL(null);
        return;
      }

      const producto = data.data;
      if (!producto) {
        setMensaje({ error: 'Producto no encontrado.' });
        setImagenURL(null);
        return;
      }

      if (producto.imagen) {
        setImagenURL(`data:image/jpeg;base64,${producto.imagen}`);
      }

      setMensaje({ ...data, data: producto });
      console.log('Completado!');
    } catch (err) {
      console.error(err);
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setNombre('');
    setMensaje(null);
    setImagenURL(null);
    setErrores({});
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Consultar Producto</h2>

        <Inputs Type='1' Place='Nombre del Producto' Value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

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

        {mensaje && mensaje.error && (
          <p className="text-red-600 text-center font-semibold text-sm mt-2">{mensaje.error}</p>
        )}

        {mensaje && mensaje.data && (
          <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>Nombre:</strong> {mensaje.data.nombre_producto}</p>
            <p><strong>Precio:</strong> {mensaje.data.precio_producto}</p>
            <p><strong>Descripción:</strong> {mensaje.data.descripcion_producto}</p>
            <p><strong>Stock:</strong> {mensaje.data.stock}</p>
            {imagenURL && (
              <img
                src={imagenURL}
                alt="Producto"
                className="mt-2 w-full h-auto rounded shadow"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
