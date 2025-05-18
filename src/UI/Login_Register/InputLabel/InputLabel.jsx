import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

export const InputLabel = ({ type, ForID, placeholder, childLabel, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const inputType =
        type === "1" ? "text" :
        type === "2" ? "email" :
        type === "3" ? (ForID === "password" ? (showPassword ? "text" : "password") : ForID === "passwordConfirm" ? (showConfirmPassword ? "text" : "password") : "password") :
        type === "4" ? "file" :
        type === "5" ? "number" :
        type === "6" ? "tel" :
        type === "7" ? "date" :
        "text"

    const placeholderText =
        type === "3" && ForID === "password" ? (showPassword ? "Contraseña" : "**********") :
            type === "3" && ForID === "passwordConfirm" ? (showConfirmPassword ? "Confirmar Contraseña" : "**********") :
                placeholder

    return (
        <div className="w-full flex flex-col gap-2 ">
            <label htmlFor={ForID} className="text-[var(--main-color)] text-2xl w-full">{childLabel}</label>
            <div className="relative w-full ">
                <input
                    type={inputType}
                    className="NeoSubContainer_inset_TOTAL inputs relative text-[var(--main-color)] w-full p-[10px_0_10px_15px] placeholder:text-[var(--main-color-sub)] border-0 outline-0"
                    value={value}
                    id={ForID}
                    onChange={onChange}
                    placeholder={placeholderText}
                />
                {type === "3" && ForID === "password" && (
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={togglePasswordVisibility}
                    />
                )}
                {type === "3" && ForID === "passwordConfirm" && (
                    <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}
                    />
                )}
            </div>
        </div>
    )
}

export default InputLabel
