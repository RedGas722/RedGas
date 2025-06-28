import { useState, useEffect, useRef } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import { buscarEmpleadoPorCorreo } from './Get/Get';
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardEmployeesBack from './Get/CardEmployeesBack';
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
    <section className="p-[var(--p-admin)] flex flex-col gap-[20px]">
      <BtnBack To='/Admin' />
      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-[var(--main-color)]">Empleados</h1>
        {/* Barra de búsqueda para consultar empleado */}
        <div className="NeoContainer_outset_TL flex w-fit items-end gap-4 bg-white p-[var(--p-admin-control)]">
          <div className='flex w-fit items-end gap-4'>
            <InputLabel
              radius='10'
              type="1"
              ForID="correo_empleado_busqueda"
              placeholder="Buscar empleado"
              childLabel="Buscar empleado"
              value={correoBusqueda}
              onChange={e => setCorreoBusqueda(e.target.value)}
              className="w-full"
              placeholderError={!!errorBusqueda}
            />
            <FontAwesomeIcon onClick={buscarEmpleado} icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--Font-Nav)]" />
            <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
          </div>
        </div>
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
      </div >


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
    </section >
  );
};

export default EmployeesBack;
