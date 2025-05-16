import { AnimatedDots } from "../../Animations/AnimatedDots/AnimatedDots"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Circles } from "../../Animations/ColorCircles/Circles"
import { HeadLR } from '../../UI/Login_Register/HeadLR/HeadLR'
import { Buttons } from "../../UI/Login_Register/Buttons"
import { Text } from "../../UI/Login_Register/Text"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'
import { useState } from "react"
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import './Login.css'

const URL = 'http://localhost:10101/ClienteLogin';

export const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        alertSendForm('wait', 'Iniciando sesión...')
        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo_cliente: correo, contraseña_cliente: contrasena }),
            });

            const data = await res.json()
            const token = data.token

            if (token) {
                const decoded = jwtDecode(token)
                const user = decoded.data.name
                
                alertSendForm(200, 'Inicio de sesión exitoso', 'Bienvenido de nuevo'+` ${user || 'Usuario'}`)
                setTimeout(() => {
                    navigate('/');
                }, 4000);
            } else {
                alertSendForm(401, 'El correo electrónico o la contraseña son incorrectos')
            }
        } catch (err) {
            alertSendForm(502, 'Error al iniciar sesión', 'Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente más tarde.')
        }

    }

    const alertSendForm = (status, title, message) => {
        const emailInput = document.getElementById('Email')
        const passwordInput = document.getElementById('Password')
        const MySwal = withReactContent(Swal);

        switch (status) {
            case 'wait':
                Swal.fire({
                    title: 'Procesando...',
                    text: message || 'Estamos procesando tu solicitud.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                break;

            case 200:
                MySwal.fire({
                    icon: 'success',
                    title: title || 'Correo enviado',
                    text: message || 'Hemos enviado el enlace de recuperación a tu correo electrónico.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                });
                emailInput.value = ''
                passwordInput.value = ''
                break;

            case 401:
                MySwal.fire({
                    html: `
                            <div style="display: flex; align-items: center;">
                            <div style="font-size: 30px; color: #3498db; margin-right: 15px;">
                                ℹ️
                            </div>
                            <div style="text-align: left;">
                                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #2c3e50;">
                                ${title || 'usuario no encontrado'}
                                </h3>
                            </div>
                            </div>
                        `,
                    showConfirmButton: false,
                    position: 'top-end',
                    width: '350px',
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#ffffff',
                });

                emailInput.style.border = '2px solid #FF0000'
                passwordInput.style.border = '2px solid #FF0000'
                break;

            case 502:
                MySwal.fire({
                    icon: 'error',
                    title: title || 'Ocurrió un error',
                    text: message || 'No pudimos completar tu solicitud. Intenta de nuevo más tarde.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar',
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/')
                            emailinput.value = ''
                        }
                    })
                break;

            default:
                MySwal.fire({
                    icon: 'error',
                    title: title || 'Error inesperado',
                    text: message || 'No se pudo procesar tu solicitud. Intenta nuevamente más tarde.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar'
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/')
                            emailinput.value = ''
                        }
                    })
                break;
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <section className="sectionLogin w-full gap-[40px] h-dvh ">
            <HeadLR />
            <AnimatedDots />
            <Circles styleC1="right-[50%] bottom-[0px]" styleC2="left-[54%] top-[120px]" styleC3="top-[400px] left-[80px]" />
            <div id='divAlert' />
            <div className="divForm z-50 shadow_box_RL bg-glass-total rounded-3xl flex flex-col items-center w-fit justify-self-center gap-[40px]">
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
                                id="Password"
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
                                <span className="custom-checkbox"></span>
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
        </section>
    );
};

export default Login;