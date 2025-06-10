import React from 'react';
import { DeleteAdmin } from "../Delete/Delete";

const CardAdminsBack = ({ admin, setRefrescar, onUpdateClick }) => {
  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar a ${admin.nombre_admin}?`);
    if (!confirmar) return;

    const { success, message } = await DeleteAdmin(admin.correo_admin);

    if (success) {
      alert(message);
      if (setRefrescar) setRefrescar(true);
    } else {
      alert(`Error: ${message}`);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[150px] flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 truncate">{admin.nombre_admin}</h2>
      <div className="mt-2 space-y-1 text-sm">
        <p><span className="font-semibold">ID:</span> {admin.id_admin}</p>
        <p><span className="font-semibold">Correo:</span> {admin.correo_admin}</p>
        <p><span className="font-semibold">Teléfono:</span> {admin.telefono_admin}</p>
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
            onClick={() => onUpdateClick(admin)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
          >
            Actualizar
          </button>
        )}
      </div>
    </div>
  );
};

export default CardAdminsBack;
