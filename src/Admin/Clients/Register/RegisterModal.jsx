import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs'

export const RegisterModal = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const URL = 'http://localhost:10101/ClienteRegister';

  const validarCampos = () => {
    const errores = {};
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre.trim()) errores.nombre = 'Nombre es requerido';
    if (!apellido.trim()) errores.apellido = 'Apellido es requerido';

    if (!correoRegex.test(correo)) errores.correo = 'Correo inválido';
    if (telefono.length !== 10 || !/^\d+$/.test(telefono)) errores.telefono = 'Teléfono debe tener 10 dígitos';
    if (contrasena.length < 8 || contrasena.length > 15) errores.contrasena = 'Contraseña debe tener entre 8 y 15 caracteres';

    return errores;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const erroresValidados = validarCampos();

    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    setErrores({});
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: nombre + ' ' + apellido,
          correo_cliente: correo,
          telefono_cliente: telefono,
          direccion_cliente: direccion,
          contraseña_cliente: contrasena
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMensaje('Error al registrar: ' + (errorData?.errors?.[0]?.msg || 'Datos inválidos'));
        return;
      }

      await res.json();
      setMensaje('Registro exitoso.');
      console.log('Completado!');
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setDireccion('');
    setContrasena('');
    setMensaje('');
    setErrores({});
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Registrar Cliente</h2>
        <Inputs Type='1' Place='Nombre del Cliente' Value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}
        <Inputs Type='1' Place='Apellido del Cliente' Value={apellido} onChange={(e) => setApellido(e.target.value)} />
        {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}
        <Inputs Type='2' Place='Correo del Cliente' Value={correo} onChange={(e) => setCorreo(e.target.value)} />
        {errores.correo && <p className="text-red-600 text-sm">{errores.correo}</p>}
        <Inputs Type='6' Place='Telefono del Cliente' Value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}
        <Inputs Type='1' Place='Direccion del Cliente' Value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <Inputs Type='3' Place='Contraseña del Cliente' Value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        {errores.contrasena && <p className="text-red-600 text-sm">{errores.contrasena}</p>}

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleRegister}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >Registrar</button>
        </div>

        {mensaje && (
          <p className={`text-center font-semibold ${mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
