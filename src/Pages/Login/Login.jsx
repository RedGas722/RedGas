import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
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

                alertSendForm(200, 'Inicio de sesión exitoso', 'Bienvenido de nuevo' + ` ${user || 'Usuario'}`)
                localStorage.setItem('token', token)
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
        <section className="sectionLogin relative text-[var(--main-color)] w-full  h-dvh ">
            <BtnBack To='/' />
            <div id='divAlert' />
            <div className="divForm p-[30px_15px_15px_15px] z-50 shadow_box_RL NeoContainer_outset_TL rounded-3xl flex flex-col items-center w-fit justify-self-center gap-[20px]">
                <h1 className="text-center text-4xl">¡Bienvenido de nuevo!</h1>
                <form className="form flex flex-col gap-[30px] justify-center items-center text-start w-full " onSubmit={handleLogin}>
                    {/* Email */}
                    <div className="flex flex-col w-full gap-2.5">
                        <label htmlFor="Email" className="text-2xl w-full">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            id="Email"
                            className="NeoSubContainer_inset_TOTAL inputs text-[var(--main-colo)] w-full p-[10px_0_10px_15px] placeholder:text-[var(--main-color-sub)] border-0 outline-0"
                            value={correo} onChange={e => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    {/* Password */}
                    <div className="flex flex-col w-full gap-2.5">
                        <label htmlFor="password" className="text-2xl w-full">
                            Contraseña
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={showPassword ? "Contraseña" : "**********"}
                                id="Password"
                                className="NeoSubContainer_inset_TOTAL inputs text-[var(--main-colo)] w-full p-[10px_0_10px_15px] placeholder:text-[var(--main-color-sub)] border-0 outline-0"
                                value={contrasena} onChange={e => setContrasena(e.target.value)}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--main-color-sub)] cursor-pointer"
                                onClick={togglePasswordVisibility}
                            />
                        </div>
                    </div>
                    <section className="flex gap-[5px] items-center justify-between w-full">
                        <label className="flex gap-[5px] items-center justify-center cursor-pointer text-[var(--main-color-sub)]">
                            <label className="flex items-center justify-center">
                                <input type="checkbox" className="input" />
                                <span className="custom-checkbox"></span>
                            </label>
                            <div>
                                <p>Recordarme</p>
                            </div>
                        </label>
                        <div className="text-[var(--main-focus)]">
                            <Link to="/Login/ForgotPassword">
                                <button className="cursor-pointer">
                                    <p>Olvidaste tu contraseña?</p>
                                </button>
                            </Link>
                        </div>
                    </section>
                    <div className="flex flex-col gap-2.5 items-center justify-center">
                        <Buttons type="submit" nameButton="Iniciar" />
                        <Text Have="No tienes cuenta?" GoTo="Regístrate aquí" nav='/Register' />
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;