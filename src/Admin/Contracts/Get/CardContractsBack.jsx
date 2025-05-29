import React from 'react';

const CardContractsBack = ({ contrato }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[220px] flex flex-col justify-between overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 truncate mb-2">Contrato #{contrato.id_contrato}</h2>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">ID Contrato:</span>
            <span className="break-words">{contrato.id_contrato}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Fecha:</span>
            <span className="break-words">{contrato.fecha_contrato}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Duración:</span>
            <span className="break-words">{contrato.duracion_contrato}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Tipo:</span>
            <span className="break-words">{contrato.tipo_contrato}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Salario:</span>
            <span className="break-words">{contrato.salario}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-1 text-sm">
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">ID Admin:</span>
          <span className="break-words">{contrato.id_admin}</span>
        </p>
        <p className="text-gray-700 font-medium flex flex-wrap gap-2">
          <span className="font-semibold">ID Empleado:</span>
          <span className="break-words">{contrato.id_empleado}</span>
        </p>
      </div>
    </div>
  );
};

export default CardContractsBack;
