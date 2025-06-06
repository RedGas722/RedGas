import { useState, useEffect } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { GetModal } from './Get/GetModal'
import { UpdateModal } from './Update/UpdateModal'
import { DeleteModal } from './Delete/DeleteModal'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardTechniciansBack from './Get/CardTechniciansBack'


export const TechniciansBack = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showGetModal, setShowGetModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [tecnicos, setTecnicos] = useState([])
  const [refrescar, setRefrescar] = useState(false)

  async function fetchTecnicos() {
    try {
      const res = await fetch('https://redgas.onrender.com/TecnicoGetAll');
      if (!res.ok) throw new Error('Error al obtener técnicos');
      const data = await res.json();
      const tecnicosData = Array.isArray(data) ? data : (data.data || []);
      setTecnicos(tecnicosData);
    } catch (error) {
      setTecnicos([])
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTecnicos()
  }, [])

  useEffect(() => {
    if (refrescar) {
      fetchTecnicos()
      setRefrescar(false)
    }
  }, [refrescar])

  return (
    <div>
      <div className="p-[10px_20px] w-full h-full flex flex-col gap-[30px]">
        <div className=' flex justify-between items-center'>
          <BtnBack To='/Admin' className='btnDown' />
          <div className='NeoContainer_outset_TL flex w-fit p-[0_0_0_20px]'>
            <h1 className="font-bold text-[20px] text-[var(--main-color)]">Técnicos</h1>
            <div className="flex p-[20px] w-fit h-fit flex-wrap justify-center justify-self-center items-center gap-[20px]">
              <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
              <ButtonBack ClickMod={() => setShowGetModal(true)} Child="Consultar" />
              <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child="Actualizar" />
              <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child="Eliminar" />
            </div>
          </div>

        </div>

        {/* Sección de técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tecnicos.map(tecnico => (
            <CardTechniciansBack key={tecnico.id_tecnico || tecnico.correo_tecnico} tecnico={tecnico} />
          ))}
        </div>

        {/* Modales */}
        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
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
    </div>
  )
}

export default TechniciansBack
