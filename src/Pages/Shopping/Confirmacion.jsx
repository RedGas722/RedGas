import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from '../../Layouts/Header/Header';

export const Confirmacion = () => {
  const [searchParams] = useSearchParams();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Token de pago no encontrado en la URL");
      setLoading(false);
      return;
    }

    const capturarPago = async () => {
      try {
        const res = await fetch("https://redgas.onrender.com/CapturarPago", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ orderID: token }) // enviar como orderID
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
      <Header />
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        {loading && <p>Confirmando pago...</p>}
        {error && <p className="text-red-600 font-semibold">Error: {error}</p>}
        {resultado && (
          <>
            <h1 className="text-3xl font-bold mb-4">¡Pago confirmado con éxito!</h1>
            <p><strong>ID de la orden:</strong> {resultado.data.id}</p>
            <p><strong>Estado:</strong> {resultado.data.status}</p>
            <p><strong>Pagado por:</strong> {resultado.data.payer.name.given_name} {resultado.data.payer.name.surname}</p>
            <p><strong>Correo:</strong> {resultado.data.payer.email_address}</p>
          </>
        )}
      </div>
    </section>
  );
};

export default Confirmacion;
