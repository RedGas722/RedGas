import { useState } from "react"
import { Circles } from "../../Animations/ColorCircles/Circles"
import { AnimatedDots } from "../../Animations/AnimatedDots/AnimatedDots"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { Buttons } from "../../UI/Login_Register/Buttons"

export const RecoveryPassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };

    return (
        <section className="w-full gap-[40px] h-dvh flex justify-center items-center">
            <AnimatedDots />
            <Circles styleC1="right-[50%] bottom-[0px]" styleC2="left-[54%] top-[120px]" styleC3="top-[400px] left-[80px]" />
            <div className="divForm shadow_box_RL bg-glass-total rounded-3xl flex flex-col w-fit items-center justify-self-center gap-[40px]">
                <h1 className="text-center text-white text-4xl">¡Recuperación Contraseña!</h1>
                <form className="flex flex-col gap-[15px] text-start w-full">
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
                </form>
                <Buttons nameButton="Enviar" />
            </div>
        </section>
    )
}
export default RecoveryPassword