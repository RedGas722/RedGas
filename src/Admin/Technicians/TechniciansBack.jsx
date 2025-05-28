import { useState, useEffect } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { GetModal } from './Get/GetModal'
import { UpdateModal } from './Update/UpdateModal'
import { DeleteModal } from './Delete/DeleteModal'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
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
      const res = await fetch('http://localhost:10101/TecnicoGetAll')
      if (!res.ok) throw new Error('Error al obtener técnicos')
      const data = await res.json()
      const tecnicosData = Array.isArray(data) ? data : (data.data || [])
      setTecnicos(tecnicosData)
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
    <div className="p-[20px] h-full flex flex-col gap-[20px]">
      <div className="NeoContainer_outset_TL flex flex-col w-fit h-fit justify-center justify-self-center items-center gap-[20px]">
        <h1 className="font-bold text-[20px]">Técnicos BACK-OFFICE</h1>
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
        <ButtonBack ClickMod={() => setShowGetModal(true)} Child="Consultar" />
        <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child="Actualizar" />
        <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child="Eliminar" />
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
          onTecnicoRegistrado={nuevoTecnico => {
            setTecnicos(prev => [nuevoTecnico, ...prev])
            setShowRegisterModal(false) 
          }}
        />
      )}
      {showGetModal && <GetModal onClose={() => setShowGetModal(false)} />}
      {showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          setRefrescar={() => {
            setRefrescar(true)
            fetchTecnicos()
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onTecnicoEliminado={correoEliminado => {
            setTecnicos(prev => prev.filter(t => t.correo_tecnico !== correoEliminado))
            setShowDeleteModal(false) // Cierra el modal tras eliminar
          }}
        />
      )}
    </div>
  )
}

export default TechniciansBack
