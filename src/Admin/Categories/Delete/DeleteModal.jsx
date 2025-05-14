import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

const URL_GET = 'http://localhost:10101/CategoriaGet';
const URL_DELETE = 'http://localhost:10101/CategoriaDelete';

export const DeleteModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const validarNombre = () => {
    const errores = {};
    if (!nombre.trim()) {
      errores.nombre = 'El nombre de la categoría es obligatorio.';
    } else if (/^\d+$/.test(nombre.trim())) {
      errores.nombre = 'El nombre no puede ser solo números.';
    }
    return errores;
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setMensaje('');
    const erroresValidados = validarNombre();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    try {
      // Paso 1: Verificar existencia
      const resGet = await fetch(`${URL_GET}?nombre_categoria=${encodeURIComponent(nombre)}`);
      const dataGet = await resGet.json();

      if (!resGet.ok || !dataGet.data || dataGet.data.length === 0) {
        throw new Error('La categoría no existe.');
      }

      // Paso 2: Proceder a eliminar si existe
      const resDelete = await fetch(`${URL_DELETE}?nombre_categoria=${encodeURIComponent(nombre)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!resDelete.ok) {
        const data = await resDelete.json();
        throw new Error(data?.errors?.[0]?.msg || 'Error al eliminar la categoría.');
      }

      setMensaje('Eliminación exitosa.');
      setErrores({});
    } catch (err) {
      setMensaje('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setNombre('');
    setMensaje('');
    setErrores({});
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-2xl p-6 shadow-lg w-[300px] flex flex-col gap-4">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center">Eliminación de Categoría</h2>

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
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Confirmar
          </button>
        </div>

        {mensaje && (
          <p
            className={`text-center font-semibold ${
              mensaje.includes('exitosa') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
