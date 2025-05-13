import React, { useState } from 'react';

export const RegisterModal = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [stock, setStock] = useState('');
    const [imagen, setImagen] = useState(null);  
    const [mensaje, setMensaje] = useState('');

    const URL = 'http://localhost:10101/ProductoRegister'; 

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (!imagen) {
            setMensaje('Por favor, seleccione una imagen.');
            return;
        }
    
        const formData = new FormData();
        formData.append('nombre_producto', nombre);
        formData.append('precio_producto', parseFloat(precio));
        formData.append('descripcion_producto', descripcion);
        formData.append('stock', parseInt(stock));
        formData.append('imagen', imagen);
    
        try {
            console.log('Registrando producto...');
    
            const res = await fetch(URL, {
                method: 'POST',
                body: formData,  
            });
    
            if (!res.ok) throw new Error('Error al registrar producto');
            const data = await res.json();
            setMensaje('Producto registrado exitosamente.');
            console.log('Completado!');
        } catch (err) {
            console.log('Error al registrar producto: ', err);  
            setMensaje('Error al registrar: ' + err.message);
        }
    };
    

    const handleCancel = () => {
        setNombre('');
        setPrecio('');
        setDescripcion('');
        setStock('');
        setImagen(null); 
        setMensaje('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Archivo seleccionado: ', file);
            setImagen(file);
        } else {
            console.log('No se ha seleccionado ningún archivo.');
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
                <button
                    className="absolute top-2 right-3 text-gray-600 text-lg"
                    onClick={onClose}
                >✕</button>

                <h2 className="text-xl font-bold text-center">Registrar Producto</h2>

                <input
                    type="text"
                    placeholder="Nombre del Producto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="border rounded p-2"
                />
                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                type="file"
                onChange={handleImageChange} 
                className="border rounded p-2"
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
