import { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs'

export const UpdateModal = ({ onClose }) => {
	const [correo, setCorreo] = useState('');
	const [cliente, setCliente] = useState(null); // datos cargados
	const [mensaje, setMensaje] = useState('');
	const [errores, setErrores] = useState({});
	const [editando, setEditando] = useState(false); // controla visibilidad de campos

	const URL_GET = 'http://localhost:10101/ClienteGet';
	const URL_UPDATE = 'http://localhost:10101/ClienteDataUpdate';

	const validarCampos = () => {
		const errores = {};
		const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!cliente.nuevo_correo_cliente.trim()) errores.nuevoCorreo = 'Correo es obligatorio';
		else if (!correoRegex.test(cliente.nuevo_correo_cliente)) errores.nuevoCorreo = 'Correo inválido';

		if (!cliente.nombre_cliente.trim()) errores.nombre = 'Nombre es obligatorio';
		if (!cliente.apellido_cliente.trim()) errores.apellido = 'Apellido es obligatorio';

		if (!cliente.telefono_cliente.trim()) errores.telefono = 'Teléfono es obligatorio';
		else if (!/^\d{10}$/.test(cliente.telefono_cliente)) errores.telefono = 'Debe tener 10 dígitos';

		if (!cliente.direccion_cliente.trim()) errores.direccion = 'Dirección es obligatoria';

		return errores;
	};

	const handleBuscar = async () => {
		setMensaje('');
		setErrores({});

		// Validar que el correo no esté vacío
		if (!correo.trim()) {
			setErrores({ correo: 'El correo es obligatorio' });
			return;
		}

		// Validar formato del correo
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
			setErrores({ correo: 'Correo inválido' });
			return;
		}

		try {
			const res = await fetch(`${URL_GET}?correo_cliente=${encodeURIComponent(correo)}`);
			if (!res.ok) throw new Error('Cliente no encontrado');

			const data = await res.json();
			if (data.data.length === 0) throw new Error('Cliente no existe');

			const fullName = data.data[0].nombre_cliente.split(' ');
			const nombre = fullName.slice(0, -1).join(' ');
			const apellido = fullName.slice(-1).join(' ');

			setCliente({
				nombre_cliente: nombre,
				apellido_cliente: apellido,
				nuevo_correo_cliente: data.data[0].correo_cliente,
				telefono_cliente: data.data[0].telefono_cliente,
				direccion_cliente: data.data[0].direccion_cliente || '',
			});
			setEditando(true);
		} catch (err) {
			setMensaje('Error al buscar cliente: ' + err.message);
		}
	};

	const handleActualizar = async () => {
		const erroresValidados = validarCampos();
		if (Object.keys(erroresValidados).length > 0) {
			setErrores(erroresValidados);
			return;
		}

		setErrores({});
		try {
			const res = await fetch(URL_UPDATE, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nombre_cliente: cliente.nombre_cliente + ' ' + cliente.apellido_cliente,
					nuevo_correo_cliente: cliente.nuevo_correo_cliente,
					telefono_cliente: cliente.telefono_cliente,
					direccion_cliente: cliente.direccion_cliente,
					correo_cliente: correo
				}),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data?.errors?.[0]?.msg || 'Error en actualización');
			}

			setMensaje('Actualización exitosa.');
		} catch (err) {
			setMensaje('Error al actualizar: ' + err.message);
		}
	};

	const handleCancelar = () => {
		setCorreo('');
		setCliente(null);
		setEditando(false);
		setMensaje('');
		setErrores({});
	};

	return (
		<div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
				<button
					className="absolute top-2 right-3 text-gray-600 text-lg"
					onClick={onClose}
				>✕</button>

				<h2 className="text-xl font-bold text-center">Actualizar Cliente</h2>

				{!editando && (
				<>
					<Inputs Type="2" Place="Correo del cliente" Value={correo} onChange={(e) => setCorreo(e.target.value)} />
					{errores.correo && (<p className="text-red-600 text-sm">{errores.correo}</p>)}
				</>
				)}

				{/* Botón buscar si aún no se editará */}
				{!editando && (
					<button
						onClick={handleBuscar}
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
					>Buscar</button>
				)}

				{/* Campos editables si ya se encontró el cliente */}
				{editando && cliente && (
					<>
						<Inputs Type='1' Place='Nuevo Nombre del Cliente' Value={cliente.nombre_cliente} onChange={(e) => setCliente({ ...cliente, nombre_cliente: e.target.value })} />
						{errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}
						<Inputs Type='1' Place='Nuevo Apellido del Cliente' Value={cliente.apellido_cliente} onChange={(e) => setCliente({ ...cliente, apellido_cliente: e.target.value })} />
						{errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}
						<Inputs Type='2' Place='Nuevo Correo del Cliente' Value={cliente.nuevo_correo_cliente} onChange={(e) => setCliente({ ...cliente, nuevo_correo_cliente: e.target.value })} />
						{errores.nuevoCorreo && <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>}
						<Inputs Type='6' Place='Nuevo Telefono del Cliente' Value={cliente.telefono_cliente} onChange={(e) => setCliente({ ...cliente, telefono_cliente: e.target.value })} />
						{errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}
						<Inputs Type='1' Place='Nueva Direccion del Cliente' Value={cliente.direccion_cliente} onChange={(e) => setCliente({ ...cliente, direccion_cliente: e.target.value })} />
						{errores.direccion && <p className="text-red-600 text-sm">{errores.direccion}</p>}

						<div className="flex justify-between gap-2">
							<button
								onClick={handleCancelar}
								className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
							>Cancelar</button>
							<button
								onClick={handleActualizar}
								className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
							>Actualizar</button>
						</div>
					</>
				)}

				{mensaje && (
					<p className={`text-center font-semibold ${mensaje.includes('exitosa') ? 'text-green-600' : 'text-red-600'}`}>
						{mensaje}
					</p>
				)}
			</div>
		</div>
	);
};
