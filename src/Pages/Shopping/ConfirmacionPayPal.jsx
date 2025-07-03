import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Header from '../../Layouts/Header/Header';

export const ConfirmacionPayPal = () => {
  const navigate = useNavigate();
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
        console.log("Respuesta completa de la factura:", dataFactura);

        if (!dataFactura?.data?.id_factura) {
          throw new Error("Backend no devolvió id_factura, respuesta: " + JSON.stringify(dataFactura));
        }
        const id_factura = dataFactura.data.id_factura;

        // Obtener el carrito desde Redis
        const resCart = await fetch("https://redgas.onrender.com/CartGet", {
            headers: {
              "Authorization": `Bearer ${tokenLocal}`,
              "Content-Type": "application/json"
            }
          });

          if (!resCart.ok) throw new Error("Error al obtener el carrito");

          const cartData = await resCart.json();
          console.log("Datos del carrito:", cartData);

          // Verificamos si hay un productId guardado
          const productIdFromLocalStorage = localStorage.getItem("paypal_productId");
          localStorage.removeItem("paypal_productId"); // Limpiar después de usar

          if (productIdFromLocalStorage) {
            // Pago individual: registrar solo ese producto
            const item = cartData.find(p => p.productId == productIdFromLocalStorage);

            if (!item) throw new Error("No se encontró el producto en el carrito");

            const resPedidoProducto = await fetch("https://redgas.onrender.com/PedidoProductoRegister", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_factura,
                id_producto: item.productId,
                estado_pedido: data.data.status,
                cantidad_producto: item.quantity
              })
            });

            const dataPedidoProducto = await resPedidoProducto.json();
            if (!resPedidoProducto.ok) {
              console.error("Error al registrar pedido producto:", dataPedidoProducto);
            }

            const resStockUpdate = await fetch("https://redgas.onrender.com/ProductoUpdateStock", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_producto: item.productId,
                stock: item.quantity
              })
            });
            const stockUpdateData = await resStockUpdate.json();
          } else {
            // Pago total: registrar todos los productos
            for (const item of cartData) {
              const id_producto = item.productId;
              const cantidad_producto = item.quantity;

              const resPedidoProducto = await fetch("https://redgas.onrender.com/PedidoProductoRegister", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_factura,
                  id_producto: id_producto,
                  estado_pedido: data.data.status,
                  cantidad_producto: cantidad_producto
                })
              });

              const dataPedidoProducto = await resPedidoProducto.json();
              if (!resPedidoProducto.ok) {
                console.error("Error al registrar pedido producto:", dataPedidoProducto);
              }
              console.log("Actualizando stock:", { id_producto, stock: cantidad_producto });

              const resStockUpdate = await fetch("https://redgas.onrender.com/ProductoUpdateStock", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_producto: id_producto,
                  stock: cantidad_producto
                })
              });
              const stockUpdateData = await resStockUpdate.json();
            }
          }
        // Marcar factura como generada
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

export default ConfirmacionPayPal;
