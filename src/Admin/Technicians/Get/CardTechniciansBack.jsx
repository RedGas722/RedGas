import React from 'react';
import { DeleteTechnician } from '../Delete/Delete';

const convertirBase64AUrl = (imagen) => {
  if (!imagen) return null;
  if (typeof imagen === 'string') return `data:image/png;base64,${imagen}`;
  if (imagen.type === 'Buffer' && Array.isArray(imagen.data)) {
    const binary = imagen.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    const base64 = btoa(binary);
    return `data:image/png;base64,${base64}`;
  }
  return null;
}

const CardTechniciansBack = ({ tecnico, setRefrescar, onUpdateClick }) => {
  const imageUrl = convertirBase64AUrl(tecnico.imagen);

  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar al técnico ${tecnico.nombre_tecnico}?`);
    if (!confirmar) return;

    const { success, message } = await DeleteTechnician(tecnico.correo_tecnico);

    if (success) {
      alert(message);
      setRefrescar && setRefrescar(true);
    } else {
      alert(`Error: ${message}`);
    }
  };

  return (
    <div className="NeoContainer_outset_TL p-4 w-fit h-fit flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-[var(--main-color)] truncate">{tecnico.nombre_tecnico}</h2>

      <div className="my-2 w-full h-[200px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tecnico.nombre_tecnico}
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-md text-[var(--main-color-sub)]">
            Foto no disponible
          </div>
        )}
      </div>

      <div className="space-y-1 text-sm">
        <p className="text-[var(--main-color)] font-medium flex flex-wrap gap-2">
          <span className="font-semibold">ID:</span>
          <span className="break-words">{tecnico.id_tecnico}</span>
        </p>
        <p className="text-[var(--main-color)] font-medium flex flex-wrap gap-2">
          <span className="font-semibold">CC:</span>
          <span className="break-words">{tecnico.cc}</span>
        </p>
        <p className="text-[var(--main-color)] font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Correo:</span>
          <span className="break-words">{tecnico.correo_tecnico}</span>
        </p>
        <p className="text-[var(--main-color)] font-medium flex flex-wrap gap-2">
          <span className="font-semibold">Teléfono:</span>
          <span className="break-words">{tecnico.telefono_tecnico}</span>
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Eliminar
        </button>
        {onUpdateClick && (
          <button
            onClick={() => onUpdateClick(tecnico)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
          >
            Actualizar
          </button>
        )}
      </div>
    </div>
  );
};

export default CardTechniciansBack;
