import { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

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
        // Validaciones de frontend
        if (!idContrato || isNaN(idContrato) || parseInt(idContrato) <= 0) {
            setMensaje('Por favor, ingresa un ID de contrato válido (mayor a 0).');
            return;
        }
        if (!fechaContrato.trim()) {
            setMensaje('Por favor, ingresa la fecha del contrato.');
            return;
        }
        if (!duracionContrato.trim()) {
            setMensaje('Por favor, ingresa la duración del contrato.');
            return;
        }
        if (!tipoContrato.trim()) {
            setMensaje('Por favor, ingresa el tipo de contrato.');
            return;
        }
        if (!salario || isNaN(salario) || parseFloat(salario) <= 0) {
            setMensaje('Por favor, ingresa un salario válido (mayor a 0).');
            return;
        }
        if (!idAdmin || isNaN(idAdmin) || parseInt(idAdmin) <= 0) {
            setMensaje('Por favor, ingresa un ID de administrador válido (mayor a 0).');
            return;
        }
        if (!idEmpleado || isNaN(idEmpleado) || parseInt(idEmpleado) <= 0) {
            setMensaje('Por favor, ingresa un ID de empleado válido (mayor a 0).');
            return;
        }
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

                <Inputs
                    Type="5"
                    Place="ID del contrato"
                    Value={idContrato}
                    onChange={(e) => setIdContrato(e.target.value)}
                />
                <Inputs
                    Type="7"
                    Place="Fecha del contrato"
                    Value={fechaContrato}
                    onChange={(e) => setFechaContrato(e.target.value)}
                />
                <Inputs
                    Type="1"
                    Place="Duración del contrato"
                    Value={duracionContrato}
                    onChange={(e) => setDuracionContrato(e.target.value)}
                />
                <Inputs
                    Type="1"
                    Place="Tipo de contrato"
                    Value={tipoContrato}
                    onChange={(e) => setTipoContrato(e.target.value)}
                />
                <Inputs
                    Type="5"
                    Place="Salario"
                    Value={salario}
                    onChange={(e) => setSalario(e.target.value)}
                />
                <Inputs
                    Type="5"
                    Place="ID del administrador"
                    Value={idAdmin}
                    onChange={(e) => setIdAdmin(e.target.value)}
                />
                <Inputs
                    Type="5"
                    Place="ID del empleado"
                    Value={idEmpleado}
                    onChange={(e) => setIdEmpleado(e.target.value)}
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
