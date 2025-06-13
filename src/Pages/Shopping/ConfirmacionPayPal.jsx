import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from '../../Layouts/Header/Header';

export const ConfirmacionPayPal = () => {
  const [searchParams] = useSearchParams();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facturaGenerada, setFacturaGenerada] = useState(false);

  useEffect(() => {
    const tokenPayPal = searchParams.get("token");
    if (!tokenPayPal) {
      setError("Token de pago no encontrado en la URL");
      setLoading(false);
      return;
    }

    const capturarPago = async () => {
      try {
        // Capturar el pago de PayPal
        const res = await fetch("https://redgas.onrender.com/CapturarPago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: tokenPayPal })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.errorInfo || "Error al capturar el pago");

        setResultado(data);

        // Extraer datos de cliente desde el token de localStorage
        const tokenLocal = localStorage.getItem("token");
        if (!tokenLocal) throw new Error("Token de cliente no encontrado en localStorage");

        const decoded = jwtDecode(tokenLocal);
        const id_cliente = decoded?.data?.id;
        if (!id_cliente) throw new Error("No se pudo extraer el id_cliente del token");

        // Obtener id_empleado de virtual@gmail.com
        const resEmpleado = await fetch("https://redgas.onrender.com/EmpleadoGet?correo_empleado=virtual@gmail.com");
        const dataEmpleado = await resEmpleado.json();
        if (!resEmpleado.ok) throw new Error(dataEmpleado.error || "No se pudo obtener el empleado virtual");

        const id_empleado = dataEmpleado.data.id_empleado;

        const fecha_factura = new Date().toISOString().split('T')[0];
        const total = parseFloat(data.data.purchase_units[0].payments.captures[0].amount.value);

        // Registrar la factura
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
        console.log(dataFactura);
        if (!dataFactura?.data?.id_factura) {
          throw new Error("El backend no devolvió el id de la factura");
        }

        const id_factura = dataFactura.data.id_factura;

        // Ahora obtenemos el carrito desde Redis
        const resCart = await fetch("https://redgas.onrender.com/CartGet", {
          headers: {
            "Authorization": `Bearer ${tokenLocal}`,
            "Content-Type": "application/json"
          }
        });

        if (!resCart.ok) throw new Error("Error al obtener el carrito");

        const cartData = await resCart.json();

        // Procesamos cada producto del carrito
        for (const item of cartData) {
          const resProducto = await fetch(`https://redgas.onrender.com/ProductoGet?nombre_producto=${encodeURIComponent(item.productName)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });

          if (!resProducto.ok) throw new Error(`Error al obtener el producto: ${item.productName}`);

          const dataProducto = await resProducto.json();
          const id_producto = dataProducto.data.id_producto;

          // Insertamos en PedidoProducto
          const resPedidoProducto = await fetch("https://redgas.onrender.com/PedidoProductoRegister", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_factura: id_factura,
              id_producto: id_producto,
              estado_pedido: resultado.data.status, // aquí defines el estado deseado
              cantidad_producto: item.quantity
            })
          });

          const dataPedidoProducto = await resPedidoProducto.json();
          if (!resPedidoProducto.ok) throw new Error(dataPedidoProducto.error || "No se pudo registrar el pedido producto");
        }

        setFacturaGenerada(true);
      } catch (err) {
        setError(err.message || "Error desconocido al confirmar el pago");
      } finally {
        setLoading(false);
      }
    };

    capturarPago();
  }, [searchParams]);

  return (
    <section className="Distribution">
      <Header />
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        {loading && <p>Confirmando pago y generando factura...</p>}
        {error && <p className="text-red-600 font-semibold">Error: {error}</p>}
        {resultado && (
          <>
            <h1 className="text-3xl font-bold mb-4">¡Pago confirmado con éxito!</h1>
            <p><strong>ID de la orden:</strong> {resultado.data.id}</p>
            <p><strong>Estado:</strong> {resultado.data.status}</p>
            <p><strong>Pagado por:</strong> {resultado.data.payer.name.given_name} {resultado.data.payer.name.surname}</p>
            <p><strong>Correo:</strong> {resultado.data.payer.email_address}</p>
            <p>
              <strong>Total:</strong>{" "}
              {resultado.data.purchase_units[0].payments.captures[0].amount.value}{" "}
              {resultado.data.purchase_units[0].payments.captures[0].amount.currency_code}
            </p>
            {facturaGenerada && (
              <p className="text-green-600 font-semibold mt-4">Factura generada correctamente y productos asociados.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ConfirmacionPayPal;
