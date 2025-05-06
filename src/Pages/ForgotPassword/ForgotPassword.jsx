import React from 'react'
import { Circles } from "../../Animations/ColorCircles/Circles"
import Buttons from '../../UI/Login_Register/Buttons'

export const ForgotPassword = () => {
    return (
        <div className='w-full flex justify-center items-center h-96 '>
            <Circles styleC1="right-[50%] bottom-[0px]" styleC2="left-[54%] top-[120px]" styleC3="top-[400px] left-[80px]" />
            <div className="divForm shadow_box_RL bg-glass-total rounded-3xl flex flex-col items-center w-fit justify-self-center gap-[40px]">
                <h1 className="text-center text-white text-4xl">¡Recuperar contraseña!</h1>
                <form className="flex flex-col gap-[15px] justify-center items-center text-start w-full">
                    {/* E-mail */}
                    <label htmlFor="Email" className="text-white text-2xl w-full">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        id="Email"
                        className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                    />
                </form>
                <Buttons nameButton="Enviar" />
            </div>
        </div>
    )
}
export default ForgotPassword

