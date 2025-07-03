import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Header from '../../Layouts/Header/Header';

export const ConfirmacionMercadoPago = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facturaGenerada, setFacturaGenerada] = useState(false);

  useEffect(() => {
    const status = searchParams.get("status");
    const payment_id = searchParams.get("payment_id");

    if (status !== "approved" || !payment_id) {
      setError("Pago no aprobado o sin ID válido");
      setLoading(false);
      return;
    }

    const yaProcesado = localStorage.getItem(`mp_pago_${payment_id}`);
    if (yaProcesado) {
    setError("Este pago ya fue procesado. No se pueden volver a tomar los datos.");
    setLoading(false);
    return;
    }

    const confirmarPago = async () => {
      try {
        // Consultar el pago
        const consulta = await fetch("https://redgas.onrender.com/CapturarPagoMP", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_id })
        });

        const pago = await consulta.json();
        if (!consulta.ok) throw new Error(pago.errorInfo || "Error al consultar pago");
        setResultado(pago.data);

        // Obtener token del cliente
        const tokenLocal = localStorage.getItem("token");
        if (!tokenLocal) throw new Error("Token de cliente no encontrado");

        const decoded = jwtDecode(tokenLocal);
        const id_cliente = decoded?.data?.id;
        if (!id_cliente) throw new Error("No se pudo extraer el id_cliente");

        // Obtener empleado virtual
        const resEmpleado = await fetch("https://redgas.onrender.com/EmpleadoGet?correo_empleado=virtual@gmail.com");
        const dataEmpleado = await resEmpleado.json();
        if (!resEmpleado.ok) throw new Error(dataEmpleado.error || "No se pudo obtener el empleado virtual");

        const id_empleado = dataEmpleado.data.id_empleado;
        const fecha_factura = new Date().toISOString().split('T')[0];
        const total = pago.data.transaction_amount;

        // Registrar factura
        const resFactura = await fetch("https://redgas.onrender.com/FacturaRegister", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha_factura,
            id_cliente,
            id_empleado,
            total
          })
        });

        const dataFactura = await resFactura.json();
        if (!dataFactura?.data?.id_factura) throw new Error("No se pudo generar la factura");

        const id_factura = dataFactura.data.id_factura;

        // Obtener carrito
        const resCart = await fetch("https://redgas.onrender.com/CartGet", {
          headers: {
            "Authorization": `Bearer ${tokenLocal}`,
            "Content-Type": "application/json"
          }
        });

        const cartData = await resCart.json();
        if (!resCart.ok) throw new Error("Error al obtener el carrito");

        const productIdFromLocalStorage = localStorage.getItem("mp_productId");
        localStorage.removeItem("mp_productId");

        if (productIdFromLocalStorage) {
          const item = cartData.find(p => p.productId == productIdFromLocalStorage);
          if (!item) throw new Error("Producto no encontrado en el carrito");

          await fetch("https://redgas.onrender.com/PedidoProductoRegister", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_factura,
              id_producto: item.productId,
              estado_pedido: "aprobado",
              cantidad_producto: item.quantity
            })
          });

          await fetch("https://redgas.onrender.com/ProductoUpdateStock", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_producto: item.productId,
              stock: item.quantity
            })
          });

        } else {
          for (const item of cartData) {
            await fetch("https://redgas.onrender.com/PedidoProductoRegister", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_factura,
                id_producto: item.productId,
                estado_pedido: "aprobado",
                cantidad_producto: item.quantity
              })
            });

            await fetch("https://redgas.onrender.com/ProductoUpdateStock", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_producto: item.productId,
                stock: item.quantity
              })
            });
          }
        }

        // Limpiar el carrito
        await fetch("https://redgas.onrender.com/CartClear", {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${tokenLocal}`,
            "Content-Type": "application/json"
        }
        });

        localStorage.setItem(`mp_pago_${payment_id}`, 'true');
        setFacturaGenerada(true);
      } catch (err) {
        setError(err.message || "Error desconocido al confirmar el pago");
      } finally {
        setLoading(false);
      }
    };

    confirmarPago();
  }, [searchParams]);

  return (
    <section className="Distribution">
      <Header />
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        {loading && <p>Confirmando pago y generando factura...</p>}
        {error && (
            <div>
                <p className="text-red-600 font-semibold mb-4">Error: {error}</p>
                <div className="mt-10 relative z-[50]">
                <button
                    className="buttonTL2 NeoSubContainer_outset_TL p-3 text-white font-bold relative z-[50]"
                    onClick={() => navigate('/')}
                >
                    Volver a la página principal
                </button>
                </div>
            </div>
        )}        

        {resultado && (
          <>
            <h1 className="text-3xl font-bold mb-4">¡Pago aprobado por Mercado Pago!</h1>
            <p><strong>ID del pago:</strong> {resultado.id}</p>
            <p><strong>Estado:</strong> {resultado.status}</p>
            <p><strong>Monto total:</strong> {resultado.transaction_amount} {resultado.currency_id}</p>
            <p><strong>Pagado por:</strong> {resultado.payer?.email}</p>
            <div className="mt-10 relative z-[50]">
                <button
                    className="buttonTL2 NeoSubContainer_outset_TL p-3 text-white font-bold relative z-[50]"
                    onClick={() => navigate('/')}
                >
                    Volver a la página principal
                </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ConfirmacionMercadoPago;
