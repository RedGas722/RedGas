import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Buttons } from "../../UI/Login_Register/Buttons";
import { Backdrop, CircularProgress } from '@mui/material';

export const ConfirmacionMercadoPago = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const status = searchParams.get("status");
    const payment_id = searchParams.get("payment_id");

    if (status !== "approved" || !payment_id) {
      setError("Pago no aprobado o sin ID válido");
      setIsLoading(false);
      return;
    }

    const confirmarPago = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    confirmarPago();
  }, [searchParams]);

  return (
    <section className="Distribution">
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        {error && (
          <div className="text-center absolute top-1/2 left-1/2 transform -translate-1/2 NeoContainer_outset_TL p-6 flex flex-col items-center justify-center gap-4">
            <p className="text-[var(--Font-Nav2)] font-semibold mb-4">Error: {error}</p>
            <div className="relative z-[50]">
              <Buttons nameButton='Volver a inicio' Onclick={() => navigate('/')} textColor='var(--main-color)' />
            </div>
          </div>
        )}

        {resultado && (
          <div className="text-center absolute top-1/2 left-1/2 transform -translate-1/2 NeoContainer_outset_TL p-6 flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold z-[2]">¡Pago aprobado por Mercado Pago!</h1>
            <div className="flex flex-col items-center justify-center gap-2">
              <p><strong>ID del pago:</strong> {resultado.id}</p>
              <p><strong>Estado:</strong> {resultado.status}</p>
              <p><strong>Monto total:</strong> {resultado.transaction_amount} {resultado.currency_id}</p>
              <p><strong>Pagado por:</strong> {resultado.payer?.email}</p>
            </div>
            <div className="">
              <Buttons nameButton='Volver a inicio' Onclick={() => navigate('/')} textColor='var(--main-color)' />
            </div>
          </div>
        )}
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  );
};

export default ConfirmacionMercadoPago;
