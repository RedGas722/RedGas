import { Buttons } from "../../UI/Login_Register/Buttons"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { Text } from "../../UI/Login_Register/Text"
import { useState } from "react"
import { InputLabel } from "../../UI/Login_Register/InputLabel/InputLabel"
import "./Register.css"
import { useNavigate } from "react-router-dom"


const URL = 'https://redgas.onrender.com/ClienteRegister'

export const Register = () => {

    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [apellido, setApellido] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [mensaje, setMensaje] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            console.log('registrando...')

            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_cliente: nombre + ' ' + apellido,
                    correo_cliente: correo,
                    telefono_cliente: telefono,
                    direccion_cliente: direccion,
                    contraseña_cliente: contrasena
                }),
            })

            if (!res.ok) throw new Error('Credenciales inválidas')
            const data = await res.json()
            setMensaje(`registro exitoso. Token: ${data.token}`)
            navigate('/login')
        } catch (err) {
            setMensaje('Error al registrar' + err.message)
        }
    }

    return (
        <div className="w-full gap-[40px] text-[var(--main-color)] h-dvh ">
            <BtnBack To='/' />
            <div className="divForm NeoContainer_outset_TL p-[30px_15px_15px_15px] flex flex-col items-center w-fit justify-self-center gap-[20px]">
                <h1 className="text-center text-4xl">¡Bienvenido!</h1>
                <form className="flex flex-col gap-[15px] justify-center items-center text-start w-fit" onSubmit={handleRegister}>
                    {/* Name, LastName */}
                    <div className="flex gap-[15px]">
                        <div className="flex flex-col">
                            <InputLabel type='1' ForID='Name' childLabel='Nombre' placeholder='Nombre' value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <InputLabel type='1' ForID='LastName' childLabel='Apellido' placeholder='Apellido' value={apellido} onChange={e => setApellido(e.target.value)} />
                        </div>
                    </div>
                    {/* Phone */}
                    <InputLabel type='6' ForID='Phone' childLabel='Telefono' placeholder='3*********' value={telefono} onChange={e => setTelefono(e.target.value)} />

                    {/* E-mail */}
                    <InputLabel type='2' ForID='email' childLabel='Correo electrónico' placeholder='example@gmail.com' value={correo} onChange={e => setCorreo(e.target.value)} />

                    {/* Password */}
                    <InputLabel type='3' ForID='password' childLabel='Contraseña' placeholder='hola' value={contrasena} onChange={e => setContrasena(e.target.value)} />

                    {/* Confirm Password */}
                    <InputLabel type='3' ForID='passwordConfirm' childLabel='Confirmar contraseña' placeholder='holas' />

                    <div className="flex flex-col items-center">
                        <Buttons nameButton="Register" />
                        <Text Have="Tienes cuenta?" GoTo="Inicia sesión aquí" nav='/Login' />
                    </div>
                </form>
                <p>{mensaje}</p>
            </div>
        </div>
    )
}

export default Register