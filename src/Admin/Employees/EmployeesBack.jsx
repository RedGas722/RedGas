import { useState, useEffect, useRef } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import { buscarEmpleadoPorCorreo } from './Get/Get';
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardEmployeesBack from './Get/CardEmployeesBack';
import Inputs from '../UI/Inputs/Inputs';

export const EmployeesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const [correoBusqueda, setCorreoBusqueda] = useState('');
  const [empleadoBuscado, setEmpleadoBuscado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);

  const contenedorRef = useRef(null);

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/EmpleadoGetAll');
      if (!res.ok) throw new Error('Error al obtener empleados');
      const data = await res.json();
      setEmpleados(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchEmpleados();
      setRefrescar(false);
      setEmpleadoBuscado(null);
      setErrorBusqueda('');
      setCorreoBusqueda('');
    }
  }, [refrescar]);

  const abrirModalActualizar = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setShowUpdateModal(true);
  };

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
      setSugerencias([]);
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  // Autocompletado en vivo
  useEffect(() => {
    if ((correoBusqueda || '').trim() === '') {
      setSugerencias([]);
      return;
    }

    const filtrados = empleados.filter((empleado) =>
      (empleado.correo_empleado || '')
        .toLowerCase()
        .includes(correoBusqueda.toLowerCase())
    );
    setSugerencias(filtrados.slice(0, 5));
  }, [correoBusqueda, empleados]);

  // Cerrar sugerencias si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setSugerencias([]);
      }
    };

    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <div className='flex-col ali'>
          <h1 className="font-bold text-[20px]">Empleado BACK-OFFICE</h1>
          <BtnBack To='/Admin' className='btnDown' />
        </div>
        {/* Barra de búsqueda para consultar empleado */}
        <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
          <Inputs
            type="1"
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
      </div >

      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

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
      {
        showRegisterModal && (
          <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
        )
      }

      {
        showUpdateModal && empleadoSeleccionado && (
          <UpdateModal
            onClose={cerrarModal}
            setRefrescar={setRefrescar}
            empleadoCarta={empleadoSeleccionado}
          />
        )
      }
    </div >
  );
};

export default EmployeesBack;
