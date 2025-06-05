import React from 'react';

const CardsEmployeesBack = ({ empleado }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[150px] flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 truncate">{empleado.nombre_empleado}</h2>

      <div className="mt-2 space-y-1 text-sm">
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">ID:</span>
          <span className="break-words">{empleado.id_empleado}</span>
        </p>
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Correo:</span>
          <span className="break-words">{empleado.correo_empleado}</span>
        </p>
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Teléfono:</span>
          <span className="break-words">{empleado.telefono_empleado}</span>
        </p>
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Dirección:</span>
          <span className="break-words">{empleado.direccion_empleado}</span>
        </p>
      </div>
    </div>
  );
};

export default CardsEmployeesBack;
