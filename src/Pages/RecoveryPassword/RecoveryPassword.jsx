import { useState } from "react"
import { Circles } from "../../Animations/ColorCircles/Circles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

export const RecoveryPassword = () => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <section className="w-full gap-[40px] h-dvh flex justify-center items-center">
            <Circles styleC1="right-[50%] bottom-[0px]" styleC2="left-[54%] top-[120px]" styleC3="top-[400px] left-[80px]" />
            <div className="divForm shadow_box_RL bg-glass-total rounded-3xl flex flex-col w-fit justify-self-center gap-[40px]">
                <h1 className="text-center text-white text-4xl">¡Recuperación Contraseña!</h1>
                <form className="flex flex-col gap-[15px] text-start w-full">
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
                </form>
            </div>
        </section>
    )
}
export default RecoveryPassword