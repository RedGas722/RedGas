import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const URL = 'http://localhost:10101/CategoriaRegister';

  // Validación del campo en el frontend
  const validarCampos = () => {
    const errores = {};
    if (!nombre.trim()) {
      errores.nombre = 'El nombre de la categoría es obligatorio.';
    } else if (/^\d+$/.test(nombre)) {
      errores.nombre = 'El nombre no puede ser solo números.';
    }
    return errores;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setMensaje('');
      return;
    }

    setErrores({});

    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_categoria: nombre }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.errors?.[0]?.msg || 'Error al registrar categoría.';
        throw new Error(errorMsg);
      }

      setMensaje('Registro exitoso.');console.log('Nombre:', nombre);
console.log('Mensaje:', mensaje);
console.log('Errores:', errores);
console.log('URL:', URL);

const validarCampos = () => {
  console.log('Validando campos...');
  const errores = {};
  if (!nombre.trim()) {
    errores.nombre = 'El nombre de la categoría es obligatorio.';
  } else if (/^\d+$/.test(nombre)) {
    errores.nombre = 'El nombre no puede ser solo números.';
  }
  console.log('Errores validados:', errores);
  return errores;
};

const handleRegister = async (e) => {
  console.log('Registrando categoría...');
  e.preventDefault();

  const erroresValidados = validarCampos();
  if (Object.keys(erroresValidados).length > 0) {
    console.log('Errores en el formulario:', erroresValidados);
    setErrores(erroresValidados);
    setMensaje('');
    return;
  }

  setErrores({});

  try {
    console.log('Enviando solicitud a:', URL);
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_categoria: nombre }),
    });

    console.log('Respuesta del servidor:', res);
    const data = await res.json();

    if (!res.ok) {
      console.log('Error en la respuesta:', data);
      const errorMsg = data?.errors?.[0]?.msg || 'Error al registrar categoría.';
      throw new Error(errorMsg);
    }

    console.log('Registro exitoso:', data);
    setMensaje('Registro exitoso.');
  } catch (err) {
    console.log('Error al registrar categoría:', err.message);
    setMensaje('Error: ' + err.message);
  }
};

const handleCancel = () => {
  console.log('Cancelando registro...');
  setNombre('');
  setMensaje('');
  setErrores({});
};
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
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center">Registrar Categoría</h2>

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
            onClick={handleRegister}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Registrar
          </button>
        </div>

        {mensaje && (
          <p
            className={`text-center font-semibold ${
              mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
