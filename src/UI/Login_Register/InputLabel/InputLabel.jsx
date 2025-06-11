import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

export const InputLabel = ({ type, ForID, placeholder, childLabel, value, onChange, required }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showCapPassword, setShowCapPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const togglePasswordCapitalPVisibility = () => {
        setShowCapPassword(!showCapPassword)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const inputType =
        type === "1" ? "text" :
        type === "2" ? "email" :
        type === "3" ? (ForID === "password" ? (showPassword ? "text" : "password") : ForID === "passwordConfirm" ? (showConfirmPassword ? "text" : "password") : ForID === "Password" ? (showCapPassword ? "text" : "password") : "password") :
        type === "4" ? "file" :
        type === "5" ? "number" :
        type === "6" ? "tel" :
        type === "7" ? "date" :
        "text"

    const placeholderText =
        type === "3" && ForID === "password" ? (showPassword ? "Contraseña" : "**********") :
        type === "3" && ForID === "Password" ? (showCapPassword ? "Contraseña" : "**********") :
        type === "3" && ForID === "passwordConfirm" ? (showConfirmPassword ? "Confirmar Contraseña" : "**********") :
        placeholder

    return (
        <div className="min-w-[230px] w-full flex flex-col gap-2 ">
            <label htmlFor={ForID} className="text-[var(--main-color)] text-[18px] w-full">{childLabel}</label>
            <div className="relative w-full ">
                {inputType !== "file" ? (
                    <input
                        type={inputType}
                        className="NeoSubContainer_inset_TOTAL inputs relative text-[var(--main-color)] w-full p-[10px_10px_10px_15px] placeholder:text-[var(--main-color-sub)] border-0 outline-0"
                        value={value}
                        id={ForID}
                        onChange={onChange}
                        placeholder={placeholderText}
                        required={required}
                    />
                ) : (
                    <input
                        type="file"
                        className="NeoSubContainer_inset_TOTAL inputs relative text-[var(--main-color)] w-full p-[10px_10px_10px_15px] placeholder:text-[var(--main-color-sub)] border-0 outline-0"
                        id={ForID}
                        onChange={onChange}
                        placeholder={placeholderText}
                        required={required}
                    />
                )}

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
                {type === "3" && ForID === "Password" && (
                    <FontAwesomeIcon
                        icon={showCapPassword ? faEyeSlash : faEye}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={togglePasswordCapitalPVisibility}
                    />
                )}
            </div>
        </div>
    )
}

export default InputLabel
