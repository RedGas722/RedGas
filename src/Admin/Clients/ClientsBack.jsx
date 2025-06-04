import { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { GetModal } from './Get/GetModal';
import { UpdateModal } from './Update/UpdateModal';
import { DeleteModal } from './Delete/DeleteModal';
import { ButtonBack } from '../UI/ButtonBack/ButtonBack';
import CardsClientsBack from './Get/CardClientsBack'; 

export const ClientsBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGetModal, setShowGetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchClientes() {
    try {
      const res = await fetch('https://redgas.onrender.com/ClienteGetAll');
      if (!res.ok) throw new Error('Error al obtener clientes');
      const data = await res.json();
      setClientes(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchClientes();
      setRefrescar(false);
    }
  }, [refrescar]);

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Cliente BACK-OFFICE</h1>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child="Consultar" />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child="Actualizar" />
        <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child="Eliminar" />
      </div>

      {/* Sección de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clientes.map(cliente => (
          <CardsClientsBack key={cliente.id_cliente} cliente={cliente} />
        ))}
      </div>

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
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

export default ClientsBack;
