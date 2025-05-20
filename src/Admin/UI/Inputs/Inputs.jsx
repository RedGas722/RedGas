export const Inputs = ({ Type, Place, Value, onChange, className }) => {
    return (
        <>
            <input
                type={
                    Type == '1' ? 'text' :
                    Type == '2' ? 'email' :
                    Type == '3' ? 'password' :
                    Type == '4' ? 'file' : // Tipo file
                    Type == '5' ? 'number' :
                    Type == '6' ? 'tel' :
                    Type == '7' ? 'date' : 'text'
                }
                placeholder={Place}
                {...(Type !== '4' && { value: Value })} // No usar value si es tipo file
                onChange={onChange}
                className={`border rounded p-2 ${className}`}
            />
        </>
    );
};

export default Inputs;