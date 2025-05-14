import { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs'

export const UpdateModal = ({ onClose }) => {

    const [nombre, setNombre] = useState('');
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [mensaje, setMensaje] = useState('');

    const URL = 'http://localhost:10101/CategoriaUpdate';

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            console.log('actualizando...');
            const res = await fetch(URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nuevo_nombre_categoria: nuevoNombre,
                    nombre_categoria: nombre}),
            });

            if (!res.ok) throw new Error('Credenciales inválidas');
            const data = await res.json();
            setMensaje('actualizacion exitosa.');
            console.log('Completado!');
        } catch (err) {
            setMensaje('Error al actualizar' + err.message);
        }
    }

    const handleCancel = () => {
        setNombre('');
        setNuevoNombre('');
        setMensaje('');
    };

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
                <button
                    className="absolute top-2 right-3 text-gray-600 text-lg"
                    onClick={onClose}
                >✕</button>

                <h2 className="text-xl font-bold text-center">Actualizar Categoria</h2>
                <Inputs Type='1' Place='Nombre de la categoria' Value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <Inputs Type='1' Place='Nuevo Nombre del Producto' Value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />

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
