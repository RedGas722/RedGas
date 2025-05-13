import { useState } from 'react';

export const UpdateModal = ({ onClose }) => {

    const [idContrato, setIdContrato] = useState('');
    const [fechaContrato, setFechaContrato] = useState('');
    const [duracionContrato, setDuracionContrato] = useState('');
    const [tipoContrato, setTipoContrato] = useState('');
    const [salario, setSalario] = useState('');
    const [idAdmin, setIdAdmin] = useState('');
    const [idEmpleado, setIdEmpleado] = useState('');
    const [mensaje, setMensaje] = useState('');

    const URL = 'http://localhost:10101/ContratoUpdate';

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            console.log('actualizando...');
            const res = await fetch(URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_contrato: idContrato,
                    fecha_contrato: fechaContrato,
                    duracion_contrato: duracionContrato,
                    tipo_contrato: tipoContrato,
                    salario: parseFloat(salario),
                    id_admin: idAdmin,
                    id_empleado: idEmpleado
                }),
            });

            if (!res.ok) throw new Error('Error al actualizar el contrato');
            await res.json();
            setMensaje('Actualización exitosa.');
            console.log('Completado!');
        } catch (err) {
            setMensaje('Error al actualizar: ' + err.message);
        }
    };

    const handleCancel = () => {
        setIdContrato('');
        setFechaContrato('');
        setDuracionContrato('');
        setTipoContrato('');
        setSalario('');
        setIdAdmin('');
        setIdEmpleado('');
        setMensaje('');
    };

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
                <button
                    className="absolute top-2 right-3 text-gray-600 text-lg"
                    onClick={onClose}
                >✕</button>

                <h2 className="text-xl font-bold text-center">Actualizar Contrato</h2>

                <input
                    type="number"
                    placeholder="ID del contrato"
                    value={idContrato}
                    onChange={(e) => setIdContrato(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="date"
                    placeholder="Fecha del contrato"
                    value={fechaContrato}
                    onChange={(e) => setFechaContrato(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="text"
                    placeholder="Duración del contrato"
                    value={duracionContrato}
                    onChange={(e) => setDuracionContrato(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="text"
                    placeholder="Tipo de contrato"
                    value={tipoContrato}
                    onChange={(e) => setTipoContrato(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="number"
                    placeholder="Salario"
                    value={salario}
                    onChange={(e) => setSalario(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="number"
                    placeholder="ID del administrador"
                    value={idAdmin}
                    onChange={(e) => setIdAdmin(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="number"
                    placeholder="ID del empleado"
                    value={idEmpleado}
                    onChange={(e) => setIdEmpleado(e.target.value)}
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
