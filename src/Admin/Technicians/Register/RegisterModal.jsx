import { useState } from 'react'
import { Inputs } from '../../UI/Inputs/Inputs'

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
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
                <button
                    className="absolute top-2 right-3 text-gray-600 text-lg"
                    onClick={onClose}
                >✕</button>

                <h2 className="text-xl font-bold text-center">Registrar Tecnico</h2>
                <Inputs Type='1' Place='Nombre del Tecnico' Value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <Inputs Type='1' Place='Apellido del Tecnico' Value={apellido} onChange={(e) => setApellido(e.target.value)} />
                <Inputs Type='2' Place='Correo del Tecnico' Value={correo} onChange={(e) => setCorreo(e.target.value)} />
                <Inputs Type='6' Place='Telefono del Tecnico' Value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                <Inputs Type='3' Place='Contraseña del Tecnico' Value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                <Inputs Type='4' Place='Imagen del Tecnico' Value={imagen} onChange={handleImageChange} />
                
                <div className="flex justify-between gap-2">
                    <button
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                    >Cancelar</button>
                    <button
                        onClick={handleRegister}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >Registrar</button>
                </div>

                {mensaje && (<p className="text-center text-green-600 font-semibold">{mensaje}</p>)}
            </div>
        </div>
    )
}
