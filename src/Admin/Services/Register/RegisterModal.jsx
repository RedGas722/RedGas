import React, { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose, setRefrescar }) => {
    const [nombreServicio, setNombreServicio] = useState('');
    const [descripcionServicio, setDescripcionServicio] = useState('');
    const [precioServicio, setPrecioServicio] = useState('');
    const [mensaje, setMensaje] = useState('');

    const URL = 'https://redgas.onrender.com/ServicioRegister';

    const handleRegister = async (e) => {
        e.preventDefault();
        // Validaciones de frontend
        if (!nombreServicio.trim()) {
            setMensaje('Por favor, ingrese el nombre del servicio.');
            return;
        }
        if (!descripcionServicio.trim()) {
            setMensaje('Por favor, ingrese la descripción del servicio.');
            return;
        }
        if (!precioServicio || isNaN(precioServicio) || parseFloat(precioServicio) <= 0) {
            setMensaje('Por favor, ingrese un precio válido (mayor a 0).');
            return;
        }
        try {
            console.log('Registrando servicio...');

            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_servicio: nombreServicio,
                    descripcion_servicio: descripcionServicio,
                    precio_servicio: precioServicio,
                }),
            });

            if (!res.ok) {
                let errorMsg = 'Error al registrar servicio';
                try {
                    const errorData = await res.json();
                    if (errorData && errorData.message) errorMsg = errorData.message;
                } catch {
                    // No se pudo extraer el mensaje del backend
                }
                throw new Error(errorMsg);
            }
            await res.json();
            setMensaje('Registro exitoso.');
            if (typeof setRefrescar === 'function') setRefrescar(true);
        } catch (err) {
            setMensaje('Error al registrar: ' + err.message);
        }
    };

    const handleCancel = () => {
        setNombreServicio('');
        setDescripcionServicio('');
        setPrecioServicio('');
        setMensaje('');
    };

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
                <button
                    className="absolute top-2 right-3 text-gray-600 text-lg"
                    onClick={onClose}
                >✕</button>

                <h2 className="text-xl font-bold text-center">Registrar Servicio</h2>

                <Inputs
                    Type="1"
                    Place="Nombre del Servicio"
                    Value={nombreServicio}
                    onChange={(e) => setNombreServicio(e.target.value)}
                />
                <textarea
                    placeholder="Descripción del Servicio"
                    value={descripcionServicio}
                    onChange={(e) => setDescripcionServicio(e.target.value)}
                    className="border rounded p-2"
                />
                <Inputs
                    Type="5"
                    Place="Precio del Servicio"
                    Value={precioServicio}
                    onChange={(e) => setPrecioServicio(e.target.value)}
                />

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
    );
};
