import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Circles } from "../../Animations/ColorCircles/Circles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { useNavigate } from "react-router-dom"
import './RecoveryPassword.css'

const URL = 'http://localhost:10101/ClienteChangePassword'

export const RecoveryPassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const {token} = useParams()
    const navigate = useNavigate()
    

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (password == confirmPassword) {
            try {
                const res = await fetch(URL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ contraseña_cliente: password })
                });

                alertSendForm(200, 'Contraseña cambiada con éxito')
                setTimeout(() => {
                    navigate('/Login')
                }, 2000);
            }
            catch (err) {
                console.log(err)
                alertSendForm(400, 'Error al cambiar la contraseña')
            }
        } else {
            alertSendForm(400, 'Las contraseñas no coinciden')
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
        }, 2000);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };

    return (
        <section className="w-full gap-[40px] h-dvh flex justify-center items-center">
            <Circles styleC1="right-[50%] bottom-[0px]" styleC2="left-[54%] top-[120px]" styleC3="top-[400px] left-[80px]" />
            <div id='divAlert' />
            <div className="divForm shadow_box_RL bg-glass-total rounded-3xl flex flex-col w-fit items-center justify-self-center gap-[40px]">
                <h1 className="text-center text-white text-4xl">¡Recuperación Contraseña!</h1>
                <form className=" form flex flex-col gap-[15px] text-start w-full" onSubmit={handleChangePassword}>
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
                            value={password} onChange={e => setPassword(e.target.value)}
                            required
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
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                        <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                        />
                    </div>
                    <Buttons type='submit' nameButton="Enviar" />
                </form>
            </div>
        </section>
    )
}
export default RecoveryPassword