
export const ButtonBack = ({ ClickMod, Child }) => {

    return (
        <>
            <button onClick={ClickMod} className={`BTN NeoContainer_outset_BR 
                ${Child ==  'Registrar' ? 'text-green-500' : ''}
                ${Child == 'Consultar' ? 'text-blue-500' : ''}
<<<<<<< HEAD
                ${Child == 'Actualizar' ? 'text-yellow-500' : ''}
=======
                ${Child == 'Actualizar' ? 'text-[var(--Font-Nav)]' : ''}
>>>>>>> 35af6dee4b0ce4c5dc6f0f6f6f61b187b135eb18
                ${Child == 'Eliminar' ? 'text-red-500' : ''}
                `}>
                {Child}
            </button>
        </>
    )
}
export default ButtonBack