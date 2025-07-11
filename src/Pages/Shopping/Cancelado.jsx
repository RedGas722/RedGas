import { useNavigate } from 'react-router-dom';
import { Buttons } from "../../UI/Login_Register/Buttons";

export const Cancelado = () => {
  const navigate = useNavigate();

  return (
    <section className="Distribution">
      <div className="MainPageContainer text-[var(--main-color)] p-8">
        <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 NeoContainer_outset_TL p-6 flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold z-[2]">Pago cancelado</h1>
          <p className="text-[var(--Font-Nav2)] font-semibold">El cliente canceló el proceso de pago.</p>
          <Buttons
            nameButton='Volver a inicio'
            Onclick={() => navigate('/')}
            textColor='var(--main-color)'
          />
        </div>
      </div>
    </section>
  );
};

export default Cancelado;
