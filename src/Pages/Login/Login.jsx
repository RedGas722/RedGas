import { useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { HeadLR } from '../../UI/Login_Register/HeadLR/HeadLR'
import { Text } from "../../UI/Login_Register/Text"
import { Circles } from "../../Animations/ColorCircles/Circles"
import { useNavigate } from "react-router-dom";
import './Login.css'

const URL = 'http://localhost:10101/ClienteLogin';

export const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo_cliente: correo, contraseña_cliente: contrasena }),
            });

            if (!res.ok) throw new Error('Credenciales inválidas');
            setMensaje('Inicio de sesión exitoso');
            navigate('/');
        } catch (err) {
            setMensaje('Error al iniciar sesión');
        }

    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <section className="sectionLogin w-full gap-[40px] h-dvh ">
            <HeadLR />
            <Circles styleC1="right-[50%] bottom-[0px]" styleC2="left-[54%] top-[120px]" styleC3="top-[400px] left-[80px]" />
            <div className="divForm shadow_box_RL bg-glass-total rounded-3xl flex flex-col items-center w-fit justify-self-center gap-[40px]">
                <h1 className="text-center text-white text-4xl">¡Bienvenido de nuevo!</h1>
                <form className="form flex flex-col gap-[30px] justify-center items-center text-start w-full " onSubmit={handleLogin}>
                    {/* Email */}
                    <div>
                        <label htmlFor="Email" className="text-white text-2xl w-full">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            id="Email"
                            className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                            value={correo} onChange={e => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    {/* Password */}
                    <div className="flex flex-col w-full">
                        <label htmlFor="password" className="text-white text-2xl w-full">
                            Contraseña
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={showPassword ? "Contraseña" : "**********"}
                                id="password"
                                className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                                value={contrasena} onChange={e => setContrasena(e.target.value)}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            />
                        </div>
                    </div>
                    <section className="flex gap-[5px] items-center justify-between w-full">
                        <label className="flex gap-[5px] items-center justify-center cursor-pointer text-white">
                            <label className="flex items-center justify-center">
                                <input type="checkbox" className="input" />
                                <span class="custom-checkbox"></span>
                            </label>
                            <div>
                                <p>Recordarme</p>
                            </div>
                        </label>
                        <div className="text-[#18BBFC]">
                            <Link to="/Login/ForgotPassword">
                                <button className="cursor-pointer">
                                    <p>Olvidaste tu contraseña?</p>
                                </button>
                            </Link>
                        </div>
                    </section>
                    <div className="flex flex-col items-center justify-center">
                        <Buttons type="submit" nameButton="Iniciar" />
                        <Text Have="No tienes cuenta?" GoTo="Regístrate aquí" nav='/Register' />
                    </div>
                </form>
            </div>
            <p>{mensaje}</p>
        </section>
    );
};

export default Login;