import { Header } from '../../Layouts/Header/Header';

export const Cancelado = () => {
  return (
    <section className="Distribution">
      <Header />
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        <h1 className="text-3xl font-bold mb-4">Pago cancelado</h1>
        <p>El cliente canceló el proceso de pago en PayPal.</p>
      </div>
    </section>
  );
};

export default Cancelado;
