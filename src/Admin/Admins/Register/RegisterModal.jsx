import React, { useState, useEffect } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const URL_GET = 'http://localhost:10101/AdminGet';
  const URL = 'http://localhost:10101/AdminRegister';

  useEffect(() => {
    // Traer datos al abrir modal
    const fetchAdmin = async () => {
      try {
        const res = await fetch(URL_GET);
        if (!res.ok) throw new Error('Error al obtener admin');
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          // Asumiendo que data.data es un array de admins, tomamos el primero
          const admin = data.data[0];

          setNombre(admin.nombre_admin || '');
          setCorreo(admin.correo_admin || '');
          setTelefono(admin.telefono_admin || '');
          // Nota: por seguridad no traemos contraseña, queda vacía
        }
      } catch (error) {
        console.error('Error fetching admin:', error.message);
      }
    };

    fetchAdmin();
  }, []);

  const validarCampos = () => {
    const errores = {};
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre.trim()) errores.nombre = 'Nombre es requerido.';
    if (!correoRegex.test(correo)) errores.correo = 'Correo inválido.';
    if (!telefono.trim() || telefono.length !== 10 || !/^\d+$/.test(telefono)) errores.telefono = 'Teléfono debe tener 10 dígitos numéricos.';
    if (contrasena.length < 8 || contrasena.length > 15) errores.contrasena = 'Contraseña debe tener entre 8 y 15 caracteres.';

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
    setMensaje('');

    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_admin: nombre.trim(),
          correo_admin: correo.trim(),
          telefono_admin: telefono.trim(),
          contraseña_admin: contrasena,
        }),
      });

      if (!res.ok) throw new Error('Error en el registro');
      await res.json();
      setMensaje('Registro exitoso.');
      if (setRefrescar) setRefrescar(true);
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const handleCancel = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
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
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center">Registrar Administrador</h2>

        <Inputs
          Type="1"
          Place="Nombre"
          Value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

        <Inputs
          Type="2"
          Place="Correo"
          Value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        {errores.correo && <p className="text-red-600 text-sm">{errores.correo}</p>}

        <Inputs
          Type="6"
          Place="Teléfono"
          Value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}

        <Inputs
          Type="3"
          Place="Contraseña"
          Value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        {errores.contrasena && <p className="text-red-600 text-sm">{errores.contrasena}</p>}

        <div className="flex justify-between gap-2 mt-2">
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
            className={`text-center font-semibold mt-2 ${
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
