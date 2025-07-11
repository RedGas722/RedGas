import { useEffect, useState } from 'react'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import CardsOffers from '../../../UI/Cards/CardsOffers/CardsOffers'

export const OffersSect = () => {
  const [ofertas, setOfertas] = useState([])

  useEffect(() => {
    async function fetchCalentadores() {
      try {
        const res = await fetch('https://redgas.onrender.com/ProductoGetAllCategoria?nombre_categoria=Ofertas');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setOfertas((data.data.data || []).filter(p => p.stock > 0));
      } catch (error) {
        console.error(error)
      }
    }
    fetchCalentadores()
  }, [])

  return (
    <section id="OffersSect" className="z-[2] NeoContainer_outset_TL !rounded-[40px] flex flex-col p-[15px] gap-[20px]">
      <TitleSectCategory IconClass='text-[var(--Font-Nav2-shadow)]' iconCategory={faDollarSign} nameCategory="Ofertas" className='flex flex-row justify-start items-center text-[var(--Font-Nav2)] gap-[8px]' />
      <CardsOffers
        uniqueId="offers"
        productos={ofertas}
      />
    </section>
  )
}

export default OffersSect;

