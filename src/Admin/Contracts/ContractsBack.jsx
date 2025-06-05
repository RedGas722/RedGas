import { useState, useEffect } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { GetModal } from './Get/GetModal'
import { UpdateModal } from './Update/UpdateModal'
import { DeleteModal } from './Delete/DeleteModal'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import CardContractsBack from './Get/CardContractsBack'

export const ContractsBack = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showGetModal, setShowGetModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [contratos, setContratos] = useState([])
    const [refrescar, setRefrescar] = useState(false)

    async function fetchContratos() {
        try {
            const res = await fetch('https://redgas.onrender.com/ContratoGetAll')
            if (!res.ok) throw new Error('Error al obtener contratos')
            const data = await res.json()
            setContratos(Array.isArray(data) ? data : (data.data || []))
        } catch (error) {
            setContratos([])
            console.error(error)
        }
    }

    useEffect(() => {
        fetchContratos()
    }, [])

    useEffect(() => {
        if (refrescar) {
            fetchContratos()
            setRefrescar(false)
        }
    }, [refrescar])

    return (
        <div className="flex flex-row h-screen p-[40px_0_0_40px] gap-[40px]">
            {/* Panel lateral izquierdo: Backoffice y botones */}
            <div className='flex flex-col items-start gap-[30px] min-w-[320px]'>
                <h1 className='font-bold text-[22px] mb-2'>Contrato BACK-OFFICE</h1>
                <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child='Registrar' />
                <ButtonBack ClickMod={() => setShowGetModal(true)} Child='Consultar' />
                <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child='Actualizar' />
                <ButtonBack ClickMod={() => setShowDeleteModal(true)} Child='Eliminar' />
            </div>

            {/* Sección de contratos, más abajo y a la derecha */}
            <div className="flex flex-col justify-start w-full mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contratos.map((contrato, idx) => (
                        <CardContractsBack
                            key={contrato.id_contrato ? String(contrato.id_contrato) : `contrato-${idx}`}
                            contrato={contrato}
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
    )
}

export default ContractsBack
