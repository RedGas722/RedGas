import { useState } from "react"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { Text } from "../../UI/Login_Register/Text"
import { HeadLR } from '../../UI/Login_Register/HeadLR/HeadLR'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import "./Register.css"
import { useNavigate } from "react-router-dom";


const URL = 'http://localhost:10101/ClienteRegister';

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [apellido, setApellido] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate(); 

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            console.log('registrando...');
            
            const res = await fetch(URL, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ 
                nombre_cliente: nombre + ' ' + apellido,
                correo_cliente: correo,
                telefono_cliente: telefono,
                direccion_cliente: direccion,
                contraseña_cliente: contrasena}),
            });
   
            if (!res.ok) throw new Error('Credenciales inválidas');
            const data = await res.json();
            setMensaje(`registro exitoso. Token: ${data.token}`);
            navigate('/login')
         } catch (err) {
            setMensaje('Error al registrar' + err.message);
         }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="sectionRegister w-full gap-[40px] h-dvh ">
            <HeadLR />
            <div className="divForm shadow_box_RL bg-glass-total rounded-3xl flex flex-col items-center w-fit justify-self-center gap-[40px]">
                <h1 className="text-center text-white text-4xl">¡Bienvenido!</h1>
                <form className="flex flex-col gap-[15px] justify-center items-center text-start w-fit" onSubmit={handleRegister}>
                    {/* Name, LastName */}
                    <div className="flex gap-[15px]">
                        <div className="flex flex-col">
                            <label htmlFor="Name" className='text-white text-2xl w-full'>Nombre</label>
                            <input 
                            type="text"
                            id="Name"
                            className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}/>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="LastName" className='text-white text-2xl w-full'>Apellido</label>
                            <input type="text"
                            id="LastName"
                            className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                            value={apellido}
                            onChange={e => setApellido(e.target.value)}/>
                        </div>
                    </div>
                    <label htmlFor="Phone" className='text-white text-2xl w-full'>Telefono</label>
                    <input 
                    type="text"
                    placeholder="3*********"
                    id="Phone"
                    className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value)}/>
                    {/* E-mail */}
                    <label htmlFor="Email" className="text-white text-2xl w-full" >
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        id="Email"
                        className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                        value={correo} 
                        onChange={e => setCorreo(e.target.value)}
                    />
                    {/* Password */}
                    <label htmlFor="password" className="text-white text-2xl w-full">
                        Contraseña
                    </label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={showPassword ? "Contraseña" : "**********"}
                            id="password"
                            className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                            value={contrasena}
                            onChange={e => setContrasena(e.target.value)}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                    {/* Confirm Password */}
                    <label htmlFor="passwordConfirm" className="text-white text-2xl w-full">
                        Confirmar contraseña
                    </label>
                    <div className="relative w-full">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={showConfirmPassword ? "Confirmar" : "*********"}
                            id="passwordConfirm"
                            className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                        />
                        <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                    <Buttons nameButton="Register"/>
                    <Text Have="Tienes cuenta?" GoTo="Inicia sesión aquí" nav='/Login' />
                </div>
                </form>
                <p>{mensaje}</p>
            </div>
        </div>
    );
};

export default Register;