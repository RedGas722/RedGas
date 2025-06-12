import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../../Layouts/Header/Header";

const ConfirmacionPse = () => {
  const [searchParams] = useSearchParams();
  const [estadoPago, setEstadoPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const refPayco = searchParams.get("x_ref_payco");

  useEffect(() => {
    const obtenerEstadoPago = async () => {
      if (!refPayco) {
        setErrorMsg("No se encontró el parámetro x_ref_payco en la URL");
        setEstadoPago(null);
        setLoading(false);
        return;
      }

      try {
        // Cambia esta URL por la de tu backend que implementa la consulta
        const response = await fetch(`http://localhost:10101/ObtenerEstadoPago/${refPayco}`);
        
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          throw new Error("No se encontraron datos en la respuesta del servidor");
        }

        setEstadoPago(data);
        setErrorMsg('');
      } catch (err) {
        console.error("Error al consultar estado de pago:", err);
        setEstadoPago(null);
        setErrorMsg(err.message || "Error desconocido");
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

  if (errorMsg) {
    return (
      <section className="Distribution">
        <Header />
        <div className="MainPageContainer text-[var(--main-color)] p-8">
          <h1 className="text-3xl font-bold mb-4">Error: {errorMsg}</h1>
          <a href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Volver al inicio</a>
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
