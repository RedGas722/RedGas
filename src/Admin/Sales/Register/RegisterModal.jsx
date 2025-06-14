import { useState } from 'react';
import { Inputs } from '../../UI/Inputs/Inputs';

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [idProducto, setIdProducto] = useState('');
  const [idFactura, setIdFactura] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [estadoPedido, setEstadoPedido] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});

  const URL = 'https://redgas.onrender.com/PedidoProductoRegister';

  const validarCampos = () => {
    const errores = {};
    if (!idProducto) errores.idProducto = 'ID producto requerido.';
    if (!idFactura) errores.idFactura = 'ID factura requerido.';
    if (!cantidadProducto || parseInt(cantidadProducto) <= 0) errores.cantidad = 'Cantidad inválida.';
    if (!estadoPedido.trim()) errores.estado = 'Estado requerido.';
    return errores;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const erroresValidados = validarCampos();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      setMensaje('');
      return;
    }

    setErrores({});
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_producto: parseInt(idProducto),
          id_factura: parseInt(idFactura),
          cantidad_producto: parseInt(cantidadProducto),
          estado_pedido: estadoPedido
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.errors?.[0]?.msg || 'Error en la solicitud');
      }

      setMensaje('Pedido registrado exitosamente.');
      if (setRefrescar) setRefrescar(true);
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message);
    }
  };

  const cancelarRegistro = () => {
    setIdProducto('');
    setIdFactura('');
    setCantidadProducto('');
    setEstadoPedido('');
    setMensaje('');
    setErrores({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[350px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Registrar Venta</h2>

        <Inputs Type="5" Place="ID Producto" Value={idProducto} onChange={(e) => setIdProducto(e.target.value)} />
        {errores.idProducto && <p className="text-red-600 text-sm">{errores.idProducto}</p>}

        <Inputs Type="5" Place="ID Factura" Value={idFactura} onChange={(e) => setIdFactura(e.target.value)} />
        {errores.idFactura && <p className="text-red-600 text-sm">{errores.idFactura}</p>}

        <Inputs Type="5" Place="Cantidad" Value={cantidadProducto} onChange={(e) => setCantidadProducto(e.target.value)} />
        {errores.cantidad && <p className="text-red-600 text-sm">{errores.cantidad}</p>}

        <Inputs Type="1" Place="Estado Pedido" Value={estadoPedido} onChange={(e) => setEstadoPedido(e.target.value)} />
        {errores.estado && <p className="text-red-600 text-sm">{errores.estado}</p>}

        <div className="flex justify-between gap-2">
          <button onClick={cancelarRegistro} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Registrar</button>
        </div>

        {mensaje && (
          <p className={`text-center font-semibold ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};
