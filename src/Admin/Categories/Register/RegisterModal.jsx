import React, { useState } from 'react';

export const RegisterModal = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState('');

  const URL = 'http://localhost:10101/CategoriaRegister';

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        console.log('registrando...');
        
        const res = await fetch(URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
            nombre_categoria: nombre}),
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
    setMensaje('');
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>

        <h2 className="text-xl font-bold text-center">Registrar Categoria</h2>

        <input
          type="text"
          placeholder="Nombre de categoria"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
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
