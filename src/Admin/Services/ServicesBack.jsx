// Delete.jsx
import React, { useState, useEffect, useRef } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import CardServicesGetBack from './Get/CardServicesGetBack';
import ButtonBack from '../UI/ButtonBack/ButtonBack';
import { buscarServicioPorNombre } from './Get/Get';
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel';

export const ServicesBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const contenedorRef = useRef(null);
  const inputRef = useRef(null);

  async function fetchServicios() {
    try {
      const res = await fetch('https://redgas.onrender.com/ServicioGetAll');
      if (!res.ok) throw new Error('Error al obtener servicios');
      const data = await res.json();
      setServicios(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      setServicios([]);
      console.error(error);
    }
  }

  useEffect(() => {
    fetchServicios();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchServicios();
      setRefrescar(false);
    }
  }, [refrescar]);

  // Para actualizar un servicio desde la tarjeta
  const handleUpdateClick = (servicio) => {
    setShowUpdateModal(servicio);
  };

  // Para eliminar un servicio desde la tarjeta
  const handleDeleteClick = (servicio) => {
    setShowDeleteModal(servicio);
  };

  // Para buscar servicios por nombre desde el input
  const handleBuscarServicio = async () => {
    if (!nombreBusqueda.trim()) {
      fetchServicios(); // Si no hay búsqueda, se recargan todos
      return;
    }

    try {
      const resultados = await buscarServicioPorNombre(nombreBusqueda);
      setServicios(resultados);
    } catch (error) {
      console.error(error);
      setServicios([]);
    }
  };

  // Autocomplete: filtra servicios por nombre
  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setSugerencias([]);
      return;
    }
    const filtrados = servicios.filter((servicio) =>
      servicio.nombre_servicio && servicio.nombre_servicio.toLowerCase().includes(nombreBusqueda.toLowerCase())
    );
    setSugerencias(filtrados.slice(0, 5));
  }, [nombreBusqueda, servicios]);

  // Cierre del dropdown si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target)
      ) {
        setSugerencias([]);
      }
    };
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  // Limpia servicios si el input queda vacío
  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      fetchServicios();
    }
  }, [nombreBusqueda]);

  return (
    <div className="flex flex-row h-screen p-[40px_0_0_40px] gap-[40px]">
      {/* Panel lateral izquierdo: Backoffice y botones */}
      <div className='flex flex-col items-start gap-[30px] min-w-[320px]'>
        <h1 className='font-bold text-[22px] mb-2'>Servicio BACK-OFFICE</h1>
        <div className="relative" ref={contenedorRef}>
          <InputLabel
            type="1"
            ForID="nombre_servicio_busqueda"
            placeholder="Buscar servicio"
            childLabel="Buscar servicio"
            value={nombreBusqueda}
            onChange={e => setNombreBusqueda(e.target.value)}
            className="w-full"
          />
          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((servicio) => (
                <li
                  key={servicio.id_servicio || servicio.nombre_servicio}
                  onClick={() => {
                    setNombreBusqueda(servicio.nombre_servicio);
                    setSugerencias([]);
                    setServicios([servicio]);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {servicio.nombre_servicio}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child='Registrar' />
        {/* <ButtonBack ClickMod={() => setShowGetModal(true)} Child='Consultar' /> */}
        {/* Eliminar y Actualizar removidos porque ya están en la card y el input de consulta ya existe */}
      </div>

      {/* Sección de servicios, más abajo y a la derecha */}
      <div className="flex flex-col justify-start w-full mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicios && servicios.length > 0 && servicios.map((servicio, idx) => (
            <CardServicesGetBack
              key={servicio.id_servicio ? String(servicio.id_servicio) : `servicio-${idx}`}
              servicio={servicio}
              setRefrescar={setRefrescar}
              onUpdateClick={handleUpdateClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setRefrescar={setRefrescar}
        />
      )}
      {/* {showGetModal && (
        <GetModal onClose={() => setShowGetModal(false)} onResult={handleShowServicios} />
      )} */}
      {typeof showUpdateModal === 'object' && showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          setRefrescar={setRefrescar}
          servicioCarta={showUpdateModal}
        />
      )}
      {typeof showDeleteModal === 'object' && showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          setRefrescar={setRefrescar}
          servicioCarta={showDeleteModal}
        />
      )}
    </div>
  );
};

export default ServicesBack;
