import { useState } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const RegisterModal = ({ onClose }) => {
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [correo, setCorreo] = useState('')
    const [telefono, setTelefono] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [imagen, setImagen] = useState(null)
    const [mensaje, setMensaje] = useState('')

    const URL = 'http://localhost:10101/TecnicoRegister'

    const handleRegister = async (e) => {
        e.preventDefault()

        if (!imagen) {
            setMensaje('Por favor, seleccione una imagen.')
            return
        }

        const formData = new FormData()
        formData.append('nombre_tecnico', nombre) + '' + apellido
        formData.append('correo_tecnico', correo)
        formData.append('telefono_tecnico', telefono)
        formData.append('contrasena_tecnico', contrasena)
        formData.append('imagen', imagen)

        try {
            console.log('Registrando Tecnico...')

            const res = await fetch(URL, {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Error al registrar Tecnico')
            const data = await res.json()
            console.log('Tecnico registrado: ', data)
            setMensaje('Tecnico registrado exitosamente.')
        } catch (err) {
            console.log('Error al registrar producto: ', err)
            setMensaje('Error al registrar: ' + err.message)
        }
    }


    const handleCancel = () => {
        setNombre('')
        setImagen(null) // Limpiar el archivo
        setMensaje('')
        setApellido('')
        setCorreo('')
        setTelefono('')
        setContrasena('')

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            console.log('Archivo seleccionado: ', file)
            setImagen(file)
        } else {
            console.log('No se ha seleccionado ningún archivo.')
        }
    }

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="NeoContainer_Admin_outset_TL p-6 w-[320px] flex flex-col gap-4 relative text-[var(--main-color)]">
                <button
                    className="absolute top-2 right-3 text-[var(--main-color)] text-lg"
                    onClick={onClose}
                >✕</button>

                <h2 className="text-xl font-bold text-center">Registrar Tecnico</h2>

                <InputLabel type='1' placeholder='Nombre del Tecnico' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <InputLabel type='1' placeholder='Apellido del Tecnico' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                <InputLabel type='2' placeholder='Correo del Tecnico' value={correo} onChange={(e) => setCorreo(e.target.value)} />
                <InputLabel type='6' placeholder='Telefono del Tecnico' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                <InputLabel type='3' placeholder='Contraseña del Tecnico' value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                <InputLabel type='4' placeholder='Imagen del Tecnico' value={imagen} onChange={handleImageChange} />
                
                <div className="flex justify-between gap-2">
                    <button
                        onClick={handleCancel}
                        className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
                    >Cancelar</button>
                    <button
                        onClick={handleRegister}
                        className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
                    >Registrar</button>
                </div>

                {mensaje && (<p className="text-center text-green-600 font-semibold">{mensaje}</p>)}
            </div>
        </div>
    )
}
