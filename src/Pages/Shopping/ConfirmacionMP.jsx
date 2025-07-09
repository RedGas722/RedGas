import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from '../../Layouts/Header/Header';

export const ConfirmacionMercadoPago = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const status = searchParams.get("status");
    const payment_id = searchParams.get("payment_id");

    if (status !== "approved" || !payment_id) {
      setError("Pago no aprobado o sin ID válido");
      setLoading(false);
      return;
    }

    const confirmarPago = async () => {
      try {
        const consulta = await fetch("https://redgas.onrender.com/CapturarPagoMP", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_id })
        });

        const pago = await consulta.json();
        if (!consulta.ok) throw new Error(pago.errorInfo || "Error al consultar pago");

        setResultado(pago.data);
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
        {loading && <p>Confirmando pago...</p>}
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
