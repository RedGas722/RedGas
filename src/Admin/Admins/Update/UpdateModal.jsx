import React, { useState } from 'react';

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
                
                    <input
                    type="email"
                    placeholder="Correo actual"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="border rounded p-2"
                />

                <input
                    type="text"
                    placeholder="Nombre del administrador"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border rounded p-2"
                />
            
                <input
                    type="email"
                    placeholder="Nuevo correo"
                    value={nuevoCorreo}
                    onChange={(e) => setNuevoCorreo(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="border rounded p-2"
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
