import { Buttons } from '../../UI/Login_Register/Buttons'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel';
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'
import { BtnBack } from '../../UI/Login_Register/BtnBack';
import { useState } from "react"
import { Text } from '../../UI/Login_Register/Text';
import withReactContent from 'sweetalert2-react-content';
import emailjs from '@emailjs/browser'
import Swal from 'sweetalert2';
import './ForgotPassword.css'

export const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const verificarCorreoEnTablas = async (correo) => {
        const rutas = [
            { url: 'https://redgas.onrender.com/ClienteEmail', campo: 'correo_cliente', tipo: 'Cliente' },
            { url: 'https://redgas.onrender.com/AdminEmail', campo: 'correo_admin', tipo: 'Admin' },
        ];

        for (const ruta of rutas) {
            try {
                const res = await fetch(ruta.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ [ruta.campo]: correo }),
                });

                const data = await res.json();
                if (res.ok && data?.token) {
                    return ruta; // Devuelve ruta, campo y tipo
                }
            } catch (error) {
                // Ignorar errores por ruta específica
            }
        }

        return null; // No se encontró en ninguna tabla
    };


    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const serviceId = 'service_82gyxy6';
        const templateId = 'template_fwkby0l';
        const publicKey = 'SHHYhi-xHJeCovrBP';

        // Validar en qué tabla está el correo
        const resultado = await verificarCorreoEnTablas(email);
        if (!resultado) {
            alertSendForm(401, 'Correo no encontrado');
            return;
        }

        const { url, campo, tipo } = resultado;

        try {
            // 🔑 Obtener token principal (JWT)
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [campo]: email }),
            });

            const data = await res.json();
            const tokenCliente = data.token;

            if (!tokenCliente) {
                alertSendForm(401, 'Correo no encontrado');
                return;
            }

            // 🛡️ Obtener token de recuperación
            const res2 = await fetch('https://redgas.onrender.com/GenerateTokenRecovery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: email }),
            });

            const data2 = await res2.json();
            const tokenRecuperacion = data2.token;

            if (!tokenRecuperacion) {
                alertSendForm(401, 'No se pudo generar token de recuperación');
                return;
            }

            const decoded = jwtDecode(tokenCliente);
            const user = decoded.data.name || 'Usuario';

            const templateParams = {
                to_email: email,
                company: 'RED-GAS',
                user: user,
                message: 'Hemos recibido su solicitud de cambio de contraseña, haga click en el siguiente enlace:',
                link: `https://redgas-one.vercel.app/Login/ForgotPassword/Recovery?tkc=${tokenCliente}&tkr=${tokenRecuperacion}&tipo=${tipo}`,
            };

            alertSendForm('wait', 'Enviando correo de recuperación...');
            emailjs.send(serviceId, templateId, templateParams, publicKey)
                .then(() => {
                    alertSendForm(200, '¡Correo de recuperación enviado!', 'Revisa tu bandeja de entrada.');
                    setTimeout(() => {
                        navigate('/Login');
                    }, 4000);
                })
                .catch(() => {
                    alertSendForm(402, 'No se pudo enviar el correo', 'Ocurrió un error al enviar el mensaje.');
                });

        } catch {
            alertSendForm(502, 'Error al procesar solicitud');
        }
    };



    const alertSendForm = (status, title, message) => {

        const MySwal = withReactContent(Swal);
        const emailinput = document.getElementById('Email')
        emailinput.style.border = 'transparent'

        switch (status) {
            case 'wait':
                Swal.fire({
                    title: 'Procesando...',
                    text: message || 'Estamos procesando tu solicitud.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    timer: 6000,
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
                emailinput.value = ''
                break;

            case 401:
                MySwal.fire({
                    icon: 'info',
                    title: title || 'Correo no encontrado',
                    html: `
            <p style="font-size: 14px;">
                No pudimos encontrar una cuenta asociada con este correo electrónico.<br/>
                Por favor, asegúrate de que lo escribiste correctamente o intenta con otro.
            </p>
        `,
                    showConfirmButton: true,
                    confirmButtonText: 'Entendido',
                    background: '#ffffff',
                    position: 'center',
                });

                emailinput.style.border = '2px solid #FF0000';
                emailinput.value = '';
                break;


            case 402:
                MySwal.fire({
                    icon: 'warning',
                    title: title || 'Error al enviar el correo',
                    text: message || 'Ocurrió un error al enviar el mensaje. Inténtalo nuevamente.',
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar',
                    timerProgressBar: true,
                    timer: 4000
                });
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

    return (

        <div className='sectionForgot flex flex-col  items-center gap-28 w-full text-[var(--main-color)] h-dvh p-[5px_5px_0_5px]'>
            <div className="z-[2] flex flex-col text-center gap-2 sm:gap-0 sm:flex-row sm:justify-between items-center w-full">
                <BtnBack To='/Login' />
                <h2 className="font-bold text-3xl sm:text-4xl text-[var(--Font-Nav)]">Registro</h2>
            </div>
            <div className="divForm NeoContainer_outset_TL z-[2] p-[30px_15px_15px_15px]  flex flex-col justify-self-center items-center h-fit w-fit gap-[30px]">
                <h1 className="text-center text-4xl">¡Recuperar contraseña!</h1>
                <form className=" flex flex-col gap-[35px] justify-center items-center text-start w-full" onSubmit={handleForgotPassword} >
                    {/* E-mail */}
                    <InputLabel type='2' ForID='Email' childLabel='Correo electrónico' placeholder='example@gmail.com' onChange={e => setEmail(e.target.value)} required />

                    <div className='flex flex-col gap-[10px] justify-center items-center text-start w-full'>
                        <Buttons type='submit' nameButton="Enviar" />
                        <Text GoTo='¿Quieres volver al Login?' nav='/Login/' />
                    </div>
                </form>
                <div className="text-white text-2xl w-full text-center">
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword

