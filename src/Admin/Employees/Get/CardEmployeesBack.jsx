import { DeleteEmployee } from '../Delete/Delete';

const CardEmployeesBack = ({ empleado, setRefrescar, onUpdateClick }) => {
  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar a ${empleado.nombre_empleado}?`);
    if (!confirmar) return;

    const { success, message } = await DeleteEmployee(empleado.correo_empleado);

    if (success) {
      alert(message);
      setRefrescar(true);
    } else {
      alert(`Error: ${message}`);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[150px] flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 truncate">{empleado.nombre_empleado}</h2>

      <div className="mt-2 space-y-1 text-sm">
        <p><span className="font-semibold">ID:</span> {empleado.id_empleado}</p>
        <p><span className="font-semibold">CC:</span> {empleado.cc_empleado}</p>
        <p><span className="font-semibold">Correo:</span> {empleado.correo_empleado}</p>
        <p><span className="font-semibold">Teléfono:</span> {empleado.telefono_empleado}</p>
        <p><span className="font-semibold">Dirección:</span> {empleado.direccion_empleado}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Eliminar
        </button>

        <button
          onClick={() => onUpdateClick(empleado)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default CardEmployeesBack;
