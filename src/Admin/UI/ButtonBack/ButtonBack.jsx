
export const ButtonBack = ({ ClickMod, Child }) => {

    return (
        <>
            <button onClick={ClickMod} className={`BTN NeoContainer_outset_BR 
                ${Child ==  'Registrar' ? 'text-green-500' : ''}
                ${Child == 'Consultar' ? 'text-blue-500' : ''}
                ${Child == 'Actualizar' ? 'text-[var(--Font-Nav)]' : ''}
                ${Child == 'Eliminar' ? 'text-red-500' : ''}
                `}>
                {Child}
            </button>
        </>
    )
}
export default ButtonBack