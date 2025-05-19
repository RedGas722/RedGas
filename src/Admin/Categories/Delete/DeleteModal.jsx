import React, { useState } from 'react';
<<<<<<< HEAD

const URL = 'http://localhost:10101/CategoriaDelete';
=======
import { Inputs } from '../../UI/Inputs/Inputs';

const URL_GET = 'http://localhost:10101/CategoriaGet';
const URL_DELETE = 'http://localhost:10101/CategoriaDelete';
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18

export const DeleteModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
<<<<<<< HEAD

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      console.log('Eliminando...');
      const res = await fetch(`${URL}?nombre_categoria=${encodeURIComponent(nombre)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      

      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      setMensaje('Eliminación exitosa');
      console.log('Completado!');
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message);
=======
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
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
    }
  };

  const handleCancel = () => {
    setNombre('');
    setMensaje('');
<<<<<<< HEAD
=======
    setErrores({});
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-2xl p-6 shadow-lg w-[300px] flex flex-col gap-4">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
<<<<<<< HEAD
        >✕</button>

        <h2 className="text-xl font-bold text-center">Eliminación de categoria</h2>

        <input
          type="text"
          placeholder="Nombre de categoria"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2"
        />
=======
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
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
<<<<<<< HEAD
          >Cancelar</button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Confirmar</button>
        </div>

        {mensaje && (<p className="text-center text-green-600 font-semibold">{mensaje}</p>)}

=======
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
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
      </div>
    </div>
  );
};
