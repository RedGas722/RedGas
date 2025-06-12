import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../../Layouts/Header/Header";

const ConfirmacionPse = () => {
  const [searchParams] = useSearchParams();
  const [estadoPago, setEstadoPago] = useState(null);
  const [loading, setLoading] = useState(true);

  const refPayco = searchParams.get("x_ref_payco");

  useEffect(() => {
    const obtenerEstadoPago = async () => {
      try {
        if (!refPayco) {
          throw new Error("Referencia Payco no encontrada");
        }

        // Llamada directa al API de ePayco para consultar el estado del pago
        const response = await fetch(`https://secure.epayco.co/validation/v1/reference/${refPayco}`);
        const data = await response.json();

        console.log("Respuesta de ePayco:", data);

        setEstadoPago(data.data);
      } catch (err) {
        console.error("Error al consultar estado de pago:", err);
        setEstadoPago(null);
      } finally {
        setLoading(false);
      }
    };

    obtenerEstadoPago();
  }, [refPayco]);

  const estadoTexto = {
    1: "Aprobado ✅",
    2: "Rechazado ❌",
    3: "Pendiente ⏳",
    4: "Fallido ⚠️",
  };

  if (loading) {
    return (
      <section className="Distribution">
        <Header />
        <div className="MainPageContainer text-[var(--main-color)] p-8">
          <h1 className="text-3xl font-bold mb-4">Consultando estado de pago...</h1>
        </div>
      </section>
    );
  }

  if (!estadoPago) {
    return (
      <section className="Distribution">
        <Header />
        <div className="MainPageContainer text-[var(--main-color)] p-8">
          <h1 className="text-3xl font-bold mb-4">No se pudo obtener el estado del pago</h1>
          <a href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Volver al inicio</a>
        </div>
      </section>
    );
  }

  return (
    <section className="Distribution">
      <Header />
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        <h1 className="text-3xl font-bold mb-4">Resultado del pago PSE</h1>

        <p><strong>Referencia Payco:</strong> {estadoPago.x_ref_payco}</p>
        <p><strong>ID de transacción:</strong> {estadoPago.x_transaction_id}</p>
        <p><strong>Estado:</strong> {estadoTexto[estadoPago.x_cod_response] || "Desconocido"}</p>
        <p><strong>Motivo:</strong> {estadoPago.x_response_reason_text}</p>
        <p><strong>Monto:</strong> {estadoPago.x_amount} {estadoPago.x_currency_code}</p>

        <a href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Volver al inicio</a>
      </div>
    </section>
  );
};

export default ConfirmacionPse;
