import React, { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { GetModal } from './Get/GetModal';
import { UpdateModal } from './Update/UpdateModal';
import { DeleteModal } from './Delete/DeleteModal';
import { BtnBack } from '../../UI/Login_Register/BtnBack';
import { UpdateModal } from './Update/Update';
import ButtonBack from '../UI/ButtonBack/ButtonBack';
import CardAdminsBack from './Get/CardAdminsBack';
import Inputs from '../UI/Inputs/Inputs';
import { GetModal } from './Get/Get';

export const AdminsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [adminSeleccionado, setAdminSeleccionado] = useState(null);
  const [correoBusqueda, setCorreoBusqueda] = useState('');
  const [adminBuscado, setAdminBuscado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [showGetModal, setShowGetModal] = useState(false);

  const URL = 'http://localhost:10101/AdminGet';

  async function fetchAdmins() {
    try {
      const res = await fetch('http://localhost:10101/AdminGetAll');
      if (!res.ok) throw new Error('Error al obtener administradores');
      const data = await res.json();
      setAdmins(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (refrescar) {
      fetchAdmins();
      setRefrescar(false);
      setAdminBuscado(null);
      setErrorBusqueda('');
      setCorreoBusqueda('');
    }
  }, [refrescar]);

  const abrirModalActualizar = (admin) => {
    setAdminSeleccionado(admin);
    setShowUpdateModal(true);
  };

  const cerrarModal = () => {
    setShowUpdateModal(false);
    setAdminSeleccionado(null);
  };

  const buscarAdmin = async () => {
    setErrorBusqueda('');
    setAdminBuscado(null);
    try {
      const res = await fetch(`${URL}?correo_admin=${encodeURIComponent(correoBusqueda)}`);
      if (!res.ok) throw new Error('No se encontró el administrador');
      const data = await res.json();
      if (!data.data) throw new Error('No se encontró el administrador');
      setAdminBuscado(data.data);
    } catch (error) {
      setErrorBusqueda(error.message);
    }
  };

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <div>
          <h1 className="font-bold text-[20px]">Admin BACK-OFFICE</h1>
          <BtnBack To='/Admin' className='btnDown' />
        </div>
        <h1 className="font-bold text-[20px]">Admin BACK-OFFICE</h1>
        <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1">
          <Inputs
            type="1"
            placeholder="Correo del administrador"
            value={correoBusqueda}
            onChange={(e) => setCorreoBusqueda(e.target.value)}
            className="outline-none"
          />
          <button
            onClick={buscarAdmin}
            aria-label="Buscar admin"
            className="text-gray-600 hover:text-gray-900"
          >
            🔍
          </button>
        </div>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>
      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminBuscado
          ? (
            <CardAdminsBack
              key={adminBuscado.id_admin}
              admin={adminBuscado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          )
          : admins.map((admin) => (
              <CardAdminsBack
                key={admin.id_admin}
                admin={admin}
                setRefrescar={setRefrescar}
                onUpdateClick={abrirModalActualizar}
              />
            ))
        }
      </div>
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
      )}
      {showGetModal && (
        <GetModal onClose={() => setShowGetModal(false)} />
      )}
      {showUpdateModal && adminSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          adminCarta={adminSeleccionado}
        />
      )}
    </div>
  );
};

export default AdminsBack;
