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
        e.preventDefault();

        // Validaciones
        if (!nombre.trim()) {
            setMensaje('Por favor, ingrese el nombre del técnico.');
            return;
        }

        if (!apellido.trim()) {
            setMensaje('Por favor, ingrese el apellido del técnico.');
            return;
        }

        if (!correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            setMensaje('Por favor, ingrese un correo válido.');
            return;
        }

        if (!telefono.trim() || !/^\d{10}$/.test(telefono)) {
            setMensaje('Por favor, ingrese un número de teléfono válido (10 dígitos).');
            return;
        }

        if (!contrasena.trim() || contrasena.length < 6) {
            setMensaje('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (!imagen) {
            setMensaje('Por favor, seleccione una imagen.');
            return;
        }

        setMensaje(''); // Limpiar mensajes de error si todo es válido

        const formData = new FormData();
        formData.append('nombre_tecnico', nombre);
        formData.append('apellido_tecnico', apellido);
        formData.append('correo_tecnico', correo);
        formData.append('telefono_tecnico', telefono);
        formData.append('contrasena_tecnico', contrasena);
        formData.append('imagen', imagen);

        try {
            console.log('Registrando Técnico...');

            const res = await fetch(URL, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Error al registrar Técnico');
            const data = await res.json();
            console.log('Técnico registrado: ', data);
            setMensaje('Técnico registrado exitosamente.');
        } catch (err) {
            console.log('Error al registrar técnico: ', err);
            setMensaje('Error al registrar: ' + err.message);
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
                <Inputs Type='4' Place='Imagen del Tecnico' onChange={handleImageChange} /> {/* Sin Value */}
                
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
