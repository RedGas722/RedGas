import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../../UI/TitleSectCategory/TitleSectCategory';
import CardsOffers from '../../../UI/Cards/CardsOffers/CardsOffers';

export const OffersSect = () => {
    return (
        <section id="OffersSect" className="flex flex-col gap-[20px]">
            <SectCategory iconCategory={faDollarSign} nameCategory="Oferta" className='flex flex-row-reverse justify-end items-center' />
            <CardsOffers uniqueId="offers"  titleCatt="Oferta" Price="999999" brandCatt="Oka"/>
        </section>
    );
};

export default OffersSect;