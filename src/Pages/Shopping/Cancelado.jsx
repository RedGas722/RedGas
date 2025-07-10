import { Header } from '../../Layouts/Header/Header';
import { useNavigate } from 'react-router-dom';


export const Cancelado = () => {
  const navigate = useNavigate();

  return (
    <section className="Distribution">
      <Header />
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        <h1 className="text-3xl font-bold mb-4">Pago cancelado</h1>
        <p>El cliente canceló el proceso de pago</p>
        <div className="mt-15 relative z-[50]">
          <button
            className="buttonTL2 NeoSubContainer_outset_TL p-3 text-white font-bold relative z-[50]"
            onClick={() => navigate('/')}
          >
            Volver a la página principal
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cancelado;
