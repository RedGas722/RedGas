import React from 'react';

const CardClientesBack = ({ cliente }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[150px] flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 truncate">{cliente.nombre_cliente}</h2>

      <div className="mt-2 space-y-1 text-sm">
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">ID:</span>
          <span className="break-words">{cliente.id_cliente}</span>
        </p>
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Correo:</span>
          <span className="break-words">{cliente.correo_cliente}</span>
        </p>
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Teléfono:</span>
          <span className="break-words">{cliente.telefono_cliente}</span>
        </p>
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Dirección:</span>
          <span className="break-words">{cliente.direccion_cliente}</span>
        </p>
      </div>
    </div>
  );
};

export default CardClientesBack;
