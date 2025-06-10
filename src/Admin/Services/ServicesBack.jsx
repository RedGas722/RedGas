// Delete.jsx
import React, { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/UpdateModal';
import CardServicesGetBack from './Get/CardServicesGetBack';
import ButtonBack from '../UI/ButtonBack/ButtonBack';

export const ServicesBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [nombreBusqueda, setNombreBusqueda] = useState("");

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
      fetchServicios(); // Si está vacío, muestra todos
      return;
    }
    try {
      const res = await fetch(`https://redgas.onrender.com/ServicioGet?nombre_servicio=${encodeURIComponent(nombreBusqueda)}`);
      if (!res.ok) throw new Error('No se encontró el servicio');
      const data = await res.json();
      setServicios(Array.isArray(data.data) ? data.data : []);
    } catch {
      setServicios([]);
    }
  };

  return (
    <div className="flex flex-row h-screen p-[40px_0_0_40px] gap-[40px]">
      {/* Panel lateral izquierdo: Backoffice y botones */}
      <div className='flex flex-col items-start gap-[30px] min-w-[320px]'>
        <h1 className='font-bold text-[22px] mb-2'>Servicio BACK-OFFICE</h1>
        <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 mb-2">
          <input
            type="text"
            placeholder="Nombre del servicio"
            value={nombreBusqueda}
            onChange={e => setNombreBusqueda(e.target.value)}
            className="outline-none px-2 py-1 w-[180px]"
          />
          <button
            onClick={handleBuscarServicio}
            aria-label="Buscar servicio"
            className="text-gray-600 hover:text-gray-900"
          >🔍</button>
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
