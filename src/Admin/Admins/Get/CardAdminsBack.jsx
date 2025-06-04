import React from 'react';

const CardAdminsBack = ({ admin }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-[220px] flex flex-col justify-between">
      <h2 className="text-xl font-semibold text-gray-800">{admin.nombre_admin}</h2>
      <p className="text-base font-semibold text-gray-800">ID: {admin.id_admin}</p>
      <p className="text-base font-semibold text-gray-800">Nombre: {admin.nombre_admin}</p>
      <p className="text-base font-semibold text-blue-700">Correo: {admin.correo_admin}</p>
      <p className="text-base font-semibold text-gray-600">Teléfono: {admin.telefono_admin}</p>
    </div>
  );
};

export default CardAdminsBack;
