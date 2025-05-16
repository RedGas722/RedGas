export const Inputs = ({ Type, Place, Value, onChange, className }) => {
    return (
        <>
            <input
                type={Type == '1' ? 'text' : Type == '2' ? 'email' : Type == '3' ? 'password' : Type == '4' ? 'file' : Type == '5' ? 'number' : Type == '6' ? 'tel' : Type == '7' ? 'date' : 'text' }
                placeholder={Place}
                value={Value}
                onChange={onChange}
                className={`border rounded p-2 ${className}`}
            />
        </>
    )
}
export default Inputs