import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Buttons } from "../../UI/Login_Register/Buttons";
import Header from '../../Layouts/Header/Header';

export const ConfirmacionPayPal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tokenPayPal = searchParams.get("token");
    if (!tokenPayPal) {
      setError("Token de pago no encontrado en la URL");
      setLoading(false);
      return;
    }

    const capturarPago = async () => {
      try {
        const res = await fetch("https://redgas.onrender.com/CapturarPago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: tokenPayPal })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.errorInfo || "Error al capturar el pago");

        setResultado(data);
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
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        {loading && <p>Confirmando pago con PayPal...</p>}
        {error && <p className="text-red-600 font-semibold">Error: {error}</p>}
        {resultado && (
          <div className="text-center absolute top-1/2 left-1/2 transform -translate-1/2 NeoContainer_outset_TL p-6 flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold z-[2]">¡Pagado por PayPal!</h1>
            <div className="flex flex-col items-center justify-center gap-2">
              <p><strong>ID del pago:</strong> {resultado.data.id}</p>
              <p><strong>Estado:</strong> {resultado.data.status}</p>
              <p><strong>Correo:</strong> {resultado.data.payer.email_address}</p>
              <p><strong>Pagado por:</strong> {resultado.data.payer.name.given_name} {resultado.data.payer.name.surname}</p>
              <p>
                <strong>Total:</strong>{" "}
                {resultado.data.purchase_units[0].payments.captures[0].amount.value}{" "}
                {resultado.data.purchase_units[0].payments.captures[0].amount.currency_code}
              </p>
            </div>
            <div className="">
              <Buttons nameButton='Volver a inicio' Onclick={() => navigate('/')} textColor='var(--main-color)' />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConfirmacionPayPal;
