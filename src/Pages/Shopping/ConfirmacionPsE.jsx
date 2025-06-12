import { useSearchParams } from "react-router-dom";
import { Header } from "../../Layouts/Header/Header";

const ConfirmacionPse = () => {
  const [searchParams] = useSearchParams();

  const refPayco = searchParams.get("x_ref_payco");
  const transactionId = searchParams.get("x_transaction_id");
  const response = searchParams.get("x_response");
  const responseReason = searchParams.get("x_response_reason_text");
  const amount = searchParams.get("x_amount");
  const currency = searchParams.get("x_currency_code");

  // Opcional: Mapeamos el estado de respuesta
  const estadoTexto = {
    "1": "Aprobado ✅",
    "2": "Rechazado ❌",
    "3": "Pendiente ⏳",
    "4": "Fallido ⚠️"
  };

  return (
    <section className="Distribution">
      <Header />
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        <h1 className="text-3xl font-bold mb-4">Resultado del pago PSE</h1>

        <p><strong>Referencia Payco:</strong> {refPayco}</p>
        <p><strong>ID de transacción:</strong> {transactionId}</p>
        <p><strong>Estado:</strong> {estadoTexto[response] || "Desconocido"}</p>
        <p><strong>Motivo:</strong> {responseReason}</p>
        <p><strong>Monto:</strong> {amount} {currency}</p>

        <a href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Volver al inicio</a>
      </div>
    </section>
  );
};

export default ConfirmacionPse;
