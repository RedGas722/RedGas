import React from 'react';

const CardServicesGetBack = ({ servicio }) => {
  if (!servicio) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[180px] flex flex-col justify-between overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 truncate mb-2">Servicio #{servicio.id_servicio}</h2>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">ID Servicio:</span>
            <span className="break-words">{servicio.id_servicio}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Nombre:</span>
            <span className="break-words">{servicio.nombre_servicio}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Descripción:</span>
            <span className="break-words">{servicio.descripcion_servicio}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Precio:</span>
            <span className="break-words">{servicio.precio_servicio}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardServicesGetBack;