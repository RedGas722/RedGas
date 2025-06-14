import React from 'react';
import { DeleteContract } from "../Delete/Delete";

const CardContractsBack = ({ contrato, setRefrescar, onUpdateClick, empleados, admins }) => {
  if (!contrato || !contrato.id_contrato) return null;
  if (!contrato.id_empleado) {
    return (
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
        <strong>Advertencia:</strong> El contrato #{contrato.id_contrato} no tiene un ID de empleado válido. No se puede eliminar.
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar el(los) contrato(s) del empleado #${contrato.id_empleado}?`);
    if (!confirmar) return;

    const { success, message } = await DeleteContract(contrato.id_empleado);

    if (success) {
      alert(message);
      if (setRefrescar) setRefrescar(true);
    } else {
      alert(`Error: ${message}`);
    }
  };

  // Buscar empleado y admin por ID
  const empleado = empleados.find(e => e.id_empleado === contrato.id_empleado);
  const admin = admins.find(a => a.id_admin === contrato.id_admin);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[150px] flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 truncate mb-2">Contrato #{contrato.id_contrato}</h2>
      <div className="mt-2 space-y-1 text-sm">
        <p><span className="font-semibold">Fecha:</span> {contrato.fecha_contrato}</p>
        <p><span className="font-semibold">Duración:</span> {contrato.duracion_contrato}</p>
        <p><span className="font-semibold">Tipo:</span> {contrato.tipo_contrato}</p>
        <p><span className="font-semibold">Salario:</span> {contrato.salario}</p>
        <p><span className="font-semibold">Admin:</span> {admin ? admin.nombre_admin + " (" + admin.correo_admin + ")" : contrato.id_admin}</p>
        <p><span className="font-semibold">Empleado:</span> {empleado ? empleado.nombre_empleado + " (" + empleado.correo_empleado + ")" : contrato.id_empleado}</p>
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
            onClick={() => onUpdateClick(contrato)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
          >
            Actualizar
          </button>
        )}
      </div>
    </div>
  );
};

export default CardContractsBack;
