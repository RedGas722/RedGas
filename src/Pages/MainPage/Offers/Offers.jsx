import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../../UI/TitleSectCategory/TitleSectCategory';
import CardsOffers from '../../../UI/Cards/CardsOffers/CardsOffers';

export const OffersSect = () => {
    return (
        <section id="OffersSect" className="flex flex-col gap-[20px]">
            <SectCategory iconCategory={faDollarSign} nameCategory="Oferta" className='flex flex-row-reverse justify-end items-center' />
            <CardsOffers uniqueId="offers"  titleCatt="Articulo" beforePrice="999999" afterPrice='888888' brandCatt="Oka" imgContent="https://armogas.com/wp-content/uploads/2024/06/calentador-8l-tn-mecanico-rheem-img-01.jpg"/>
        </section>
    );
};

export default OffersSect;