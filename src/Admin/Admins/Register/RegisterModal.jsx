import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');

    const URL = 'http://localhost:10101/AdminRegister';

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            console.log('Registrando administrador...');

            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre_admin: nombre,
                    correo_admin: correo,
                    telefono_admin: telefono,
                    contraseña_admin: contrasena
                }),
            });

            if (!res.ok) throw new Error('Error en el registro');
            await res.json();
            setMensaje('Registro exitoso.');
        } catch (err) {
            setMensaje('Error al registrar: ' + err.message);
        }
    };

    const handleCancel = () => {
        setNombre('');
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

                <h2 className="text-xl font-bold text-center">Registrar Administrador</h2>

                <Inputs
                    Type="1"
                    Place="Nombre"
                    Value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <Inputs
                    Type="2"
                    Place="Correo"
                    Value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
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
                        onClick={handleRegister}
                        className="bg-green-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >Registrar</button>
                </div>

                {mensaje && (<p className="text-center text-green-600 font-semibold">{mensaje}</p>)}
            </div>
        </div>
    );
};
