import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

export const InputLabel = ({
    radius,
    type,
    ForID,
    placeholder,
    childLabel,
    value,
    onChange,
    required,
    autoComplete,
    className,
    placeholderError,
    showCurrency = false, // ← NUEVA PROP
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showCapPassword, setShowCapPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const togglePasswordVisibility = () => setShowPassword(!showPassword)
    const togglePasswordCapitalPVisibility = () => setShowCapPassword(!showCapPassword)
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

    const inputType =
        type === "1" ? "text" :
            type === "2" ? "email" :
                type === "3" ? (
                    ForID === "password" ? (showPassword ? "text" : "password") :
                        ForID === "passwordConfirm" ? (showConfirmPassword ? "text" : "password") :
                            ForID === "Password" ? (showCapPassword ? "text" : "password") :
                                "password"
                ) :
                    type === "4" ? "file" :
                        type === "5" ? "number" :
                            type === "6" ? "tel" :
                                type === "7" ? "date" :
                                    type === "8" ? "textarea" :
                                        "text"

    const placeholderText =
        type === "3" && ForID === "password" ? (showPassword ? "Contraseña" : "**********") :
            type === "3" && ForID === "Password" ? (showCapPassword ? "Contraseña" : "**********") :
                type === "3" && ForID === "passwordConfirm" ? (showConfirmPassword ? "Confirmar Contraseña" : "**********") :
                    placeholder

    return (
        <div className="min-w-[230px] w-full flex flex-col gap-2">
            <label htmlFor={ForID} className={`text-[var(--main-color)] text-[18px] w-full ${className}`}>
                {childLabel}
            </label>
            <div className="w-full relative">
                {inputType === "textarea" ? (
                    <textarea
                        className={`NeoSubContainer_inset_TOTAL inputs resize-none text-[var(--main-color)] w-full p-[10px_10px_10px_15px] border-0 outline-0 ${placeholderError ? "placeholder:text-red-500" : "placeholder:text-[var(--main-color-sub)]"
                            }`}
                        style={{
                            borderRadius: `${radius || 20}px`,
                        }}
                        value={value}
                        id={ForID}
                        onChange={onChange}
                        placeholder={placeholderText}
                        required={required}
                        rows={4}
                    />
                ) : inputType !== "file" ? (
                    <div className="relative w-full">
                        {type === "5" && showCurrency && (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--Font-Nav)] text-2xl font-medium pointer-events-none select-none z-10">
                                $
                            </span>
                        )}
                        <input
                            onPaste={type === "3" ? (e => e.preventDefault()) : undefined}
                            type={inputType}
                            className={`NeoSubContainer_inset_TOTAL inputs relative text-[var(--main-color)] !w-full border-0 outline-0 ${showCurrency && type === "5" ? "pl-8 w-full" : "p-[10px_10px_10px_15px]"
                                } ${placeholderError ? 'placeholder:text-red-500' : 'placeholder:text-[var(--main-color-sub)]'} ${type === "5" && showCurrency
                                    ? "pl-8 pr-4 py-[10px]" // más padding izq si hay símbolo
                                    : "p-[10px_10px_10px_15px]"
                                }`}
                            style={{
                                borderRadius: `${radius || 20}px`,
                            }}
                            value={value}
                            id={ForID}
                            onChange={onChange}
                            placeholder={placeholderText}
                            autoComplete={autoComplete}
                            required={required}
                        />
                    </div>
                ) : (
                    <input
                        type="file"
                        className={`NeoSubContainer_inset_TOTAL inputs relative text-[var(--main-color)] w-full p-[10px_10px_10px_15px] border-0 outline-0 ${placeholderError ? 'placeholder:text-red-500' : 'placeholder:text-[var(--main-color-sub)]'
                            }`}
                        id={ForID}
                        onChange={onChange}
                        placeholder={placeholderText}
                        required={required}
                    />
                )}

                {/* Iconos de mostrar/ocultar contraseña */}
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
