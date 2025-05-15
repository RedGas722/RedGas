import { NavLink } from 'react-router-dom'
import { Circles } from '../../Animations/ColorCircles/Circles'
import { HeadLR } from '../../UI/Login_Register/HeadLR/HeadLR'
import { Buttons } from '../../UI/Login_Register/Buttons'
import { Link } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'
import emailjs from '@emailjs/browser'
import { useState } from "react"
import { AnimatedDots } from "../../Animations/AnimatedDots/AnimatedDots"
import './ForgotPassword.css'

const URL = 'http://localhost:10101/ClienteEmail'

export const ForgotPassword = () => {

    const [correo, setCorreo] = useState('')

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const serviceId = 'service_82gyxy6'
        const templateId = 'template_fwkby0l'
        const publicKey = 'SHHYhi-xHJeCovrBP'

        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo_cliente: correo }),
            });

            const data = await res.json()
            const token = data.token

            if (token) {
                const decoded = jwtDecode(token)
                const user = decoded.data.name

                console.log('Nombre:', user)

                const templateParams = {
                    to_email: correo,
                    company: 'RED-GAS',
                    user: user || 'Usuario',
                    message: 'Hemos recibido su solicitud de cambio de contraseña, haga click en el siguiente enlace:',
                    link: `http://localhost:5173/Login/ForgotPassword/Recovery/${token}`,
                }

                emailjs.send(serviceId, templateId, templateParams, publicKey)
                    .then((result) => {
                        console.log('Correo enviado exitosamente', result.status, result.text);

                        alertSendForm(result.status, 'Correo de recuperación enviado');
                    })
                    .catch((error) => {
                        console.log('Error al enviar el correo', error.text);
                        alertSendForm(400, 'Error al enviar el correo');
                    });
            } else {
                alertSendForm(410, 'Error al enviar el correo');
            }

        } catch (err) {
            alertSendForm(400, 'El correo no esta registrador');
        }


    }

    const alertSendForm = (status, mensaje) => {
        const alert = document.getElementById('divAlert')
        alert.style.display = 'block'


        if (status === 200) {
            alert.style.background = '#68ff00'
            alert.textContent = `✅ ${mensaje}`
        } else {
            alert.style.background = '#ff004a'
            alert.textContent = `❌ ${mensaje}`
        }

        setTimeout(() => {
            alert.style.display = 'none'
        }, 4000);

    }
    return (

        <div className='sectionForgot w-full gap-[40px] h-dvh '>
            <HeadLR />
            <AnimatedDots />
            <Circles styleC1="left-[54%] top-[100px]" styleC2="right-[58%] bottom-[120px]" styleC3="top-[50px] left-[80px]" />
            <div id='divAlert'></div>
            <div className=" form shadow_box_RL bg-glass-total rounded-3xl flex flex-col justify-self-center items-center h-fit w-fit gap-[30px]">
                <h1 className="text-center text-white text-4xl">¡Recuperar contraseña!</h1>
                <form className=" flex flex-col gap-[35px] justify-center items-center text-start w-full" onSubmit={handleForgotPassword} >
                    {/* E-mail */}
                    <div className='flex flex-col gap-[10px] justify-center items-center text-start w-full'>
                        <label htmlFor="Email" className="text-white text-2xl w-full">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            id="Email"
                            className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                            onChange={e => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-[10px] justify-center items-center text-start w-full'>
                        {/* ⬇️------------------------QUITARRRRRRRRRRRRRRR--------------------------------------- ⬇️*/}
                        <NavLink to={"/Login/ForgotPassword/Recovery"}>
                            <Buttons type='submit' nameButton="Enviar" />
                        </NavLink>
                        {/* ^------------------------QUITARRRRRRRRRRRRRRR--------------------------------------^ */}
                        <Link to="/Login/">
                            <button className="cursor-pointer text-[#18BBFC]">
                                <p>¿Quieres volver al Login?</p>
                            </button>
                        </Link>
                    </div>
                </form>
                <div className="text-white text-2xl w-full text-center">
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword

