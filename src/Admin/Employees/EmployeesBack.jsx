import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import { buscarEmpleadoPorCorreo } from './Get/Get';
import CardEmployeesBack from './Get/CardEmployeesBack';

export const EmployeesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  // Estado para el empleado que se va a actualizar
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  // Estado para la búsqueda de empleado por correo
  const [correoBusqueda, setCorreoBusqueda] = useState('');
  const [empleadoBuscado, setEmpleadoBuscado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const URL = 'https://redgas.onrender.com/EmpleadoGet';

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
      // Al refrescar la lista, limpiamos la búsqueda y error para mostrar todas las tarjetas
      setEmpleadoBuscado(null);
      setErrorBusqueda('');
      setCorreoBusqueda('');
    }
  }, [refrescar]);

  // Función para abrir el modal de actualización con empleado seleccionado
  const abrirModalActualizar = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setShowUpdateModal(true);
  };

  // Función para cerrar modal actualización y limpiar estado
  const cerrarModal = () => {
    setShowUpdateModal(false);
    setEmpleadoSeleccionado(null);
  };

  const buscarEmpleado = async () => {
    setErrorBusqueda('');
    setEmpleadoBuscado(null);

    try {
      const resultado = await buscarEmpleadoPorCorreo(correoBusqueda);
      setEmpleadoBuscado(resultado);
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Empleado BACK-OFFICE</h1>
          {/* Barra de búsqueda para consultar empleado */}
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
            <input
              type="text"
              placeholder="Correo del empleado"
              value={correoBusqueda}
              onChange={(e) => setCorreoBusqueda(e.target.value)}
              className="outline-none"
            />
            <button
              onClick={buscarEmpleado}
              aria-label="Buscar empleado"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />        
      </div>

      {/* Mostrar mensaje de error */}
      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      {/* Sección de empleados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {empleadoBuscado
          ? (
            <CardEmployeesBack
              key={empleadoBuscado.id_empleado}
              empleado={empleadoBuscado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          )
          : empleados.map((empleado) => (
              <CardEmployeesBack
                key={empleado.id_empleado}
                empleado={empleado}
                setRefrescar={setRefrescar}
                onUpdateClick={abrirModalActualizar}
              />
            ))
        }
      </div>

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
      )}

      {showUpdateModal && empleadoSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          empleadoCarta={empleadoSeleccionado}
        />
      )}
    </div>
  );
};

export default EmployeesBack;
