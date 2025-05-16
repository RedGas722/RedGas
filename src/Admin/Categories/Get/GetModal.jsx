import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const GetModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [errores, setErrores] = useState({});

  const URL = 'http://localhost:10101/CategoriaGet';

  // Validar nombre antes de hacer la solicitud
  const validarCampos = () => {
    const errores = {};

    if (!nombre.trim()) {
      errores.nombre = 'El nombre de la categoría es obligatorio.';
    } else if (/^\d+$/.test(nombre)) {
      errores.nombre = 'El nombre no puede ser solo números.';
    }

    return errores;
  };

  const handleGet = async (e) => {
    e.preventDefault();

    const erroresValidos = validarCampos();
    if (Object.keys(erroresValidos).length > 0) {
      setErrores(erroresValidos);
      setMensaje(null);
      return;
    }

    setErrores({});
    try {
      console.log('Consultando...');
      const res = await fetch(`${URL}?nombre_categoria=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok || !data.data || data.data.length === 0) {
        throw new Error(data?.errors?.[0]?.msg || 'Categoría no encontrada.');
      }

      setMensaje(data);
      console.log('Consulta completada');
    } catch (err) {
      setMensaje({ error: 'Error al consultar: ' + err.message });
    }
  };

  const handleCancel = () => {
    setMensaje(null);
    setErrores({});
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center">Consultar Categoría</h2>

        <Inputs
          Type="1"
          Place="Nombre de la categoría"
          Value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        {errores.nombre && (
          <p className="text-red-600 text-sm">{errores.nombre}</p>
        )}

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleGet}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Consultar
          </button>
        </div>

        {/* Mostrar resultado si existe */}
        {mensaje?.data && mensaje.data.length > 0 && (
          <div className="bg-gray-100 p-3 rounded mt-2 text-sm">
            <p><strong>ID:</strong> {mensaje.data[0].id_categoria}</p>
            <p><strong>Nombre:</strong> {mensaje.data[0].nombre_categoria}</p>
          </div>
        )}

        {/* Mostrar error si existe */}
        {mensaje?.error && (
          <p className="text-red-600 text-sm text-center mt-2 font-semibold">
            {mensaje.error}
          </p>
        )}
      </div>
    </div>
  );
};
