// Delete.jsx
import { useState } from 'react'
import { DeleteModal } from './Delete/DeleteModal'
import { GetModal } from './Get/GetModal' // Asegúrate de crear este componente también
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/UpdateModal'

export const ClientsBack = () => {
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showGetModal, setShowGetModal] = useState(false)
	const [showRegisterModal, setShowRegisterModal] = useState(false)
	const [showUpdateModal, setShowUpdateModal] = useState(false)


	return (
		<div className="h-[95%] flex flex-col justify-center justify-self-center self-center items-center gap-[20px]">
			<h1>Cliente BACK-OFFICE</h1>
			<button
				onClick={() => setShowRegisterModal(true)}
				className="bg-green-500 text-white px-4 py-2 rounded"
			>Registrar</button>

			<button
				onClick={() => setShowGetModal(true)}
				className="bg-blue-500 text-white px-4 py-2 rounded"
			>Consultar</button>

			<button
				onClick={() => setShowUpdateModal(true)}
				className="bg-yellow-500 text-white px-4 py-2 rounded"
			>Actualizar</button>

			<button
				onClick={() => setShowDeleteModal(true)}
				className="bg-red-500 text-white px-4 py-2 rounded"
			>Eliminar</button>

			{showRegisterModal && (
				<RegisterModal onClose={() => setShowRegisterModal(false)} />
			)}

			{showGetModal && (
				<GetModal onClose={() => setShowGetModal(false)} />
			)}

			{showUpdateModal && (
				<UpdateModal onClose={() => setShowUpdateModal(false)} />
			)}

			{showDeleteModal && (
				<DeleteModal onClose={() => setShowDeleteModal(false)} />
			)}
		</div>
	)
}
export default ClientsBack
