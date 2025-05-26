import React from 'react';

const convertirBase64AUrl = (imagen) => {
  if (!imagen) return null;
  if (typeof imagen === 'string') {
    return `data:image/jpeg;base64,${imagen}`;
  }
  // Si viene como buffer tipo { type: 'Buffer', data: [...] }
  if (typeof imagen === 'object' && imagen.type === 'Buffer' && Array.isArray(imagen.data)) {
    // Convertimos el array de bytes a base64
    const binary = imagen.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64 = btoa(binary);
    return `data:image/png;base64,${base64}`;
  }
  return null;
};

const CardTechniciansBack = ({ tecnico }) => {
  const imageUrl = convertirBase64AUrl(tecnico.imagen);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-[400px] flex flex-col justify-between">
      <h2 className="text-xl font-semibold text-gray-800">{tecnico.nombre_tecnico}</h2>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={tecnico.nombre_tecnico}
          className="w-full h-[220px] object-contain rounded-md my-2"
        />
      ) : (
        <div className="w-full h-[220px] flex justify-center items-center bg-gray-200 rounded-md text-gray-500">
          Foto no disponible
        </div>
      )}
      <p className="text-base font-semibold text-gray-800">Nombre: {tecnico.nombre_tecnico}</p>
      <p className="text-base font-semibold text-blue-700">Correo: {tecnico.correo_tecnico}</p>
      <p className="text-base font-semibold text-gray-600">Teléfono: {tecnico.telefono_tecnico}</p>
    </div>
  );
};

export default CardTechniciansBack;
