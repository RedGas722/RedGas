import React, { useState } from 'react';

export const RegisterModal = ({ onClose }) => {
    const [IDcliente, setIDcliente] = useState('');
    const [IDempleado, setIDempleado] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
    const [mensaje, setMensaje] = useState('');

  const URL = 'http://localhost:10101/FacturaRegister';

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        console.log('registrando...');
        
        const res = await fetch(URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
            id_cliente: IDcliente,
            id_empleado: IDempleado,
            fecha_factura: fecha,}),
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
    setIDcliente(0);
    setIDempleado(0);
    setFecha(new Date().toISOString().slice(0, 10));
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
          type="number"
          placeholder="Id del cliente"
          value={IDcliente}
          onChange={(e) => setIDcliente(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Id del empleado"
          value={IDempleado}
          onChange={(e) => setIDempleado(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          placeholder="fecha de la factura"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
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
