import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Header } from '../../Layouts/Header/Header';

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
        // Capturamos el pago de PayPal
        const res = await fetch("https://redgas.onrender.com/CapturarPago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: tokenPayPal })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.errorInfo || "Error al capturar el pago");

        setResultado(data);

        // Obtenemos id_cliente desde el token de localStorage
        const tokenLocal = localStorage.getItem("token");
        if (!tokenLocal) throw new Error("Token de cliente no encontrado en localStorage");

        const decoded = jwtDecode(tokenLocal);
        const id_cliente = decoded?.data?.id_cliente;
        if (!id_cliente) throw new Error("No se pudo extraer el id_cliente del token");

        // Obtenemos el id_empleado de "virtual@gmail.com"
        const resEmpleado = await fetch("https://redgas.onrender.com/EmpleadoGet?correo_empleado=virtual@gmail.com");
        const dataEmpleado = await resEmpleado.json();
        if (!resEmpleado.ok) throw new Error(dataEmpleado.error || "No se pudo obtener el empleado virtual");

        const id_empleado = dataEmpleado.data.id_empleado;

        // Obtenemos fecha actual
        const fecha_factura = new Date().toISOString().split('T')[0]; // formato yyyy-mm-dd

        // Obtenemos el total desde el pago de PayPal
        const total = parseFloat(data.data.purchase_units[0].payments.captures[0].amount.value);

        // Registramos la factura
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
        if (!resFactura.ok) throw new Error(dataFactura.error || "No se pudo registrar la factura");

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
              <p className="text-green-600 font-semibold mt-4">Factura generada correctamente.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ConfirmacionPayPal;
