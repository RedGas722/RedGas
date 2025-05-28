// Delete.jsx
import React, { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/UpdateModal';
import { DeleteModal } from './Delete/DeleteModal';
import { GetModal } from './Get/GetModal';
import CardServicesGetBack from './Get/CardServicesGetBack';
import ButtonBack from '../UI/ButtonBack/ButtonBack';

export const ServicesBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGetModal, setShowGetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchServicios() {
    try {
      const res = await fetch('http://localhost:10101/ServicioGetAll');
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

  // Para mostrar resultados de búsqueda individual
  const handleShowServicios = (data) => {
    setServicios(data);
  };

  return (
    <div className="flex flex-row h-screen p-[40px_0_0_40px] gap-[40px]">
      {/* Panel lateral izquierdo: Backoffice y botones */}
      <div className='flex flex-col items-start gap-[30px] min-w-[320px]'>
        <h1 className='font-bold text-[22px] mb-2'>Servicio BACK-OFFICE</h1>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child='Registrar' />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child='Consultar' />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child='Actualizar' />
        <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child='Eliminar' />
      </div>

      {/* Sección de servicios, más abajo y a la derecha */}
      <div className="flex flex-col justify-start w-full mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicios && servicios.length > 0 && servicios.map((servicio, idx) => (
            <CardServicesGetBack
              key={servicio.id_servicio ? String(servicio.id_servicio) : `servicio-${idx}`}
              servicio={servicio}
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
      {showGetModal && (
        <GetModal onClose={() => setShowGetModal(false)} onResult={handleShowServicios} />
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

export default ServicesBack;
