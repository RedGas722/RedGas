import React, { useState } from 'react';
<<<<<<< HEAD

const URL = 'http://localhost:10101/ProductoDelete';

export const DeleteModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      console.log('Eliminando...');
      const res = await fetch(`${URL}?nombre_producto=${encodeURIComponent(nombre)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      

      if (!res.ok) throw new Error('Credenciales inválidas');
      await res.json();
      setMensaje('Eliminación exitosa');
      console.log('Completado!');
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setNombre('');
    setMensaje('');
=======
import { Inputs } from '../../UI/Inputs/Inputs';

const URL_GET = 'http://localhost:10101/ProductoGet';
const URL_DELETE = 'http://localhost:10101/ProductoDelete';

export const DeleteModal = ({ onClose, setRefrescar }) => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  
  // Validación del nombre del producto
  const validarNombre = () => {
    const errores = {};
    if (!nombreProducto.trim()) {
      errores.nombreProducto = 'El nombre del producto es obligatorio.';
    } else if (/^\d+$/.test(nombreProducto)) {
      errores.nombreProducto = 'El nombre no puede ser solo números.';
    }
    return errores;
  };

  // Función para eliminar el producto
  const handleDelete = async (e) => {
    e.preventDefault();
    
    // Validar nombre del producto
    const erroresValidos = validarNombre();
    if (Object.keys(erroresValidos).length > 0) {
      setErrores(erroresValidos);
      setMensaje('');
      return;
    }

    setErrores({});
    try {
      // Primero verificar si el producto existe
      const resGet = await fetch(`${URL_GET}?nombre_producto=${encodeURIComponent(nombreProducto)}`);
      if (!resGet.ok) throw new Error('Producto no encontrado');

      const dataGet = await resGet.json();
      if (!dataGet?.data) throw new Error('Producto no existe');

      // Si el producto existe, proceder a eliminarlo
      const resDelete = await fetch(`${URL_DELETE}?nombre_producto=${encodeURIComponent(nombreProducto)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!resDelete.ok) throw new Error('Error al eliminar el producto');

      setMensaje('Producto eliminado exitosamente.');
      if (setRefrescar) setRefrescar(true);
    } catch (err) {
      setMensaje('Error: ' + err.message);
    }
  };

  // Función para cancelar
  const handleCancel = () => {
    setNombreProducto('');
    setMensaje('');
    setErrores({});
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
<<<<<<< HEAD
      <div className="bg-white relative rounded-2xl p-6 shadow-lg w-[300px] flex flex-col gap-4">
=======
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

<<<<<<< HEAD
        <h2 className="text-xl font-bold text-center">Eliminación de producto</h2>

        <input
          type="text"
          placeholder="Nombre Producto..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2"
        />
=======
        <h2 className="text-xl font-bold text-center">Eliminar Producto</h2>

        {/* Campo de entrada para el nombre del producto */}
        <Inputs
          Type="1"
          Place="Nombre del Producto"
          Value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
        />
        {errores.nombreProducto && <p className="text-red-600 text-sm">{errores.nombreProducto}</p>}
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
            Eliminar
          </button>
        </div>

        {/* Mensaje de éxito o error */}
        {mensaje && (
          <p
            className={`text-center font-semibold ${
              mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'
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
