import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { GetModal } from './Get/GetModal';
import { UpdateModal } from './Update/UpdateModal';
import { DeleteModal } from './Delete/DeleteModal';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import CardsEmployeesBack from './Get/CardEmployeesBack';

export const EmployeesBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGetModal, setShowGetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchEmpleados() {
    try {
      const res = await fetch('https://redgas.onrender.com/EmpleadoGetAll');
      if (!res.ok) throw new Error('Error al obtener empleados');
      const data = await res.json();
      setEmpleados(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchEmpleados();
      setRefrescar(false);
    }
  }, [refrescar]);

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Empleado BACK-OFFICE</h1>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child="Consultar" />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child="Actualizar" />
        <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child="Eliminar" />
      </div>

      {/* Sección de empleados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {empleados.map(empleado => (
          <CardsEmployeesBack key={empleado.id_empleado} empleado={empleado} />
        ))}
      </div>

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onEmpleadoRegistrado={(nuevoEmpleado) => {
            setEmpleados(prev => [nuevoEmpleado, ...prev]);
          }}
          setRefrescar={setRefrescar}
        />
      )}

      {showGetModal && (
        <GetModal onClose={() => setShowGetModal(false)} />
      )}

      {showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          setRefrescar={setRefrescar}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          setRefrescar={setRefrescar}
        />
      )}
    </div>
  );
};

export default EmployeesBack;
