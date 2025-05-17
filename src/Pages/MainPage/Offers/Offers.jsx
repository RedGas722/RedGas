import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import { CardsOffers } from '../../../UI/Cards/CardsOffers/CardsOffers'

export const OffersSect = () => {
    return (
        <section id="OffersSect" className="NeoContainer_outset_TL flex flex-col p-[15px] gap-[20px]">
            <TitleSectCategory iconCategory={faDollarSign} nameCategory="Oferta" className='flex flex-row-reverse justify-end items-center' />
            <CardsOffers uniqueId="offers" titleCatt="Articulo" beforePrice="999999" afterPrice='888888' brandCatt="Oka" imgContent="https://armogas.com/wp-content/uploads/2024/06/calentador-8l-tn-mecanico-rheem-img-01.jpg" />
        </section>
    )
}

export default OffersSect