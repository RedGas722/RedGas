import React, { useState } from 'react';

export const RegisterModal = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [apellido, setApellido] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');

  const URL = 'http://localhost:10101/EmpleadoRegister';

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        console.log('registrando...');
        
        const res = await fetch(URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
            nombre_empleado: nombre + ' ' + apellido,
            correo_empleado: correo,
            telefono_empleado: telefono,
            direccion_empleado: direccion,
            contraseña_empleado: contrasena}),
        });

        if (!res.ok) throw new Error('Credenciales inválidas');
        const data = await res.json();
        setMensaje('registro exitoso.');
        console.log('Completado!');
     } catch (err) {
        setMensaje('Error al registrar' + err.message);
     }
}

  const handleCancel = () => {
    setNombre('');
    setCorreo('');
    setApellido('');
    setDireccion('');
    setTelefono('');
    setContrasena('');
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Registrar Empleado</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Direccion"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="border rounded p-2"
        />

<div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={handleRegister}
            className="bg-green-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Registrar</button>
        </div>

        {mensaje && (<p className="text-center text-green-600 font-semibold">{mensaje}</p>)}
      </div>
    </div>
  );
};
