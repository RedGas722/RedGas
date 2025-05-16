// Delete.jsx
import { useState } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { GetModal } from './Get/GetModal'
import { UpdateModal } from './Update/UpdateModal'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'

export const FacturesBack = () => {
    const [showGetModal, setShowGetModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)

    return (
        <div className="p-[20px_0_0_20px] flex items-start gap-[20px] justify-start h-screen">
            <div className='flex items-center gap-[20px] justify-center'>
                <h1 className='font-bold text-[20px]'>Factura BACK-OFFICE</h1>
                <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child='Registrar' />
                <ButtonBack ClickMod={() => setShowGetModal(true)} Child='Consultar' />
                <ButtonBack ClickMod={() => setShowUpdateModal(true)} Child='Actualizar' />
            </div>

            {showRegisterModal && (
                <RegisterModal onClose={() => setShowRegisterModal(false)} />
            )}

            {showGetModal && (
                <GetModal onClose={() => setShowGetModal(false)} />
            )}

            {showUpdateModal && (
                <UpdateModal onClose={() => setShowUpdateModal(false)} />
            )}
        </div>
    )
}
export default FacturesBack;
