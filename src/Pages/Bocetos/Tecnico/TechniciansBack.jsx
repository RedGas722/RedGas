// Delete.jsx
import { useState } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { GetModal } from './Get/GetModal'
// import { UpdateModal } from './Update/UpdateModal'
// import { DeleteModal } from './Delete/DeleteModal'


export const TechniciansBack = () => {
  //   const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showGetModal, setShowGetModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  //   const [showUpdateModal, setShowUpdateModal] = useState(false)


  return (
    <div className="p-[20px_0_0_20px] flex items-start gap-[20px] justify-start h-screen">
      <div className='flex items-center gap-[20px] justify-center'>
        <h1 className='font-bold text-[20px]'>Técnicos: Regitro / Consulta</h1>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="BTN NeoContainer_outset_BR text-green-500"
        >Registrar</button>
        <button
          onClick={() => setShowGetModal(true)}
          className="BTN NeoContainer_outset_BR text-red-500"
        >Consultar</button>
      </div>
      {/* 
      <button
        onClick={() => setShowUpdateModal(true)}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >Actualizar</button>

      <button
        onClick={() => setShowDeleteModal(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >Eliminar</button> */}

      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}

      {showGetModal && (
        <GetModal onClose={() => setShowGetModal(false)} />
      )}

      {/* {showUpdateModal && (
        <UpdateModal onClose={() => setShowUpdateModal(false)} />
      )}

      {showDeleteModal && (
        <DeleteModal onClose={() => setShowDeleteModal(false)} />
      )} */}
    </div>
  )
}
export default TechniciansBack