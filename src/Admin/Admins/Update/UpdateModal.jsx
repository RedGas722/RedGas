import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const UpdateModal = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [nuevoCorreo, setNuevoCorreo] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');

    const URL = 'http://localhost:10101/AdminUpdate';

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Validaciones de frontend
        if (!correo.trim()) {
            setMensaje('Por favor, ingrese el correo actual.');
            return;
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(correo)) {
            setMensaje('Por favor, ingrese un correo actual válido.');
            return;
        }
        if (!nombre.trim()) {
            setMensaje('Por favor, ingrese el nombre del administrador.');
            return;
        }
        if (!nuevoCorreo.trim()) {
            setMensaje('Por favor, ingrese el nuevo correo.');
            return;
        }
        if (!regex.test(nuevoCorreo)) {
            setMensaje('Por favor, ingrese un nuevo correo válido.');
            return;
        }
        if (!telefono.trim()) {
            setMensaje('Por favor, ingrese el teléfono.');
            return;
        }
        if (!/^[0-9]+$/.test(telefono)) {
            setMensaje('El teléfono solo debe contener números.');
            return;
        }
        if (!contrasena.trim()) {
            setMensaje('Por favor, ingrese la contraseña.');
            return;
        }
        try {
            console.log('Actualizando administrador...');

            const res = await fetch(URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre_admin: nombre,
                    new_correo_admin: nuevoCorreo,
                    telefono_admin: telefono,
                    contraseña_admin: contrasena,
                    correo_admin: correo
                }),
            });

            if (!res.ok) throw new Error('Error al actualizar el administrador');
            await res.json();
            setMensaje('Actualización exitosa.');
        } catch (err) {
            setMensaje('Error al actualizar: ' + err.message);
        }
    };

    const handleCancel = () => {
        setNombre('');
        setNuevoCorreo('');
        setCorreo('');
        setTelefono('');
        setContrasena('');
        setMensaje('');
    };

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
                <button
                    className="absolute top-2 right-3 text-gray-600 text-lg"
                    onClick={onClose}
                >✕</button>

                <h2 className="text-xl font-bold text-center">Actualizar Administrador</h2>
                <Inputs
                    Type="2"
                    Place="Correo actual"
                    Value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
                <Inputs
                    Type="1"
                    Place="Nombre del administrador"
                    Value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <Inputs
                    Type="2"
                    Place="Nuevo correo"
                    Value={nuevoCorreo}
                    onChange={(e) => setNuevoCorreo(e.target.value)}
                />
                <Inputs
                    Type="6"
                    Place="Teléfono"
                    Value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                />
                <Inputs
                    Type="3"
                    Place="Contraseña"
                    Value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                />

                <div className="flex justify-between gap-2">
                    <button
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                    >Cancelar</button>
                    <button
                        onClick={handleUpdate}
                        className="bg-yellow-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >Actualizar</button>
                </div>

                {mensaje && (<p className="text-center text-green-600 font-semibold">{mensaje}</p>)}
            </div>
        </div>
    );
};
