import React, { useState, useEffect } from 'react';
import { RegisterModal } from './Register/RegisterModal';
import { GetModal } from './Get/GetModal';
import { UpdateModal } from './Update/UpdateModal';
import { DeleteModal } from './Delete/DeleteModal';
import { BtnBack } from '../../UI/Login_Register/BtnBack';
import ButtonBack from '../UI/ButtonBack/ButtonBack';
import CardAdminsBack from './Get/CardAdminsBack';

export const AdminsBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGetModal, setShowGetModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchAdmins() {
    try {
      const res = await fetch('http://localhost:10101/AdminGetAll');
      if (!res.ok) throw new Error('Error al obtener administradores');
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      setAdmins([]);
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
    }
  }, [refrescar]);

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <div>
          <h1 className="font-bold text-[20px]">Admin BACK-OFFICE</h1>
          <BtnBack To='/Admin' className='btnDown' />
        </div>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child="Consultar" />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child="Actualizar" />
        <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child="Eliminar" />
      </div>

      {/* Sección de admins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {admins.map((admin, idx) => (
          <CardAdminsBack
            key={admin.id_admin ? String(admin.id_admin) : (admin.correo_admin ? admin.correo_admin : `admin-${idx}`)}
            admin={admin}
          />
        ))}
      </div>

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onAdminRegistrado={nuevoAdmin => {
            setAdmins(prev => [nuevoAdmin, ...prev]);
            setRefrescar(true);
          }}
          setRefrescar={setRefrescar}
        />
      )}
      {showGetModal && <GetModal onClose={() => setShowGetModal(false)} />}
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

export default AdminsBack;
