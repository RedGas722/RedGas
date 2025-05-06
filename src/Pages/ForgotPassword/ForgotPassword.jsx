import React from 'react'
import { Circles } from "../../Animations/ColorCircles/Circles"
import { Buttons } from '../../UI/Login_Register/Buttons'
import { HeadLR } from '../../UI/Login_Register/HeadLR/HeadLR'
import './ForgotPassword.css'

export const ForgotPassword = () => {
    return (
        <div className='sectionForgot w-full gap-[40px] h-dvh '>
            <HeadLR />
            <Circles styleC1="left-[54%] top-[100px]" styleC2="right-[58%] bottom-[120px]" styleC3="top-[50px] left-[80px]" />
            <div className="divForm shadow_box_RL bg-glass-total rounded-3xl flex flex-col justify-self-center items-center h-fit w-fit gap-[40px]">
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

