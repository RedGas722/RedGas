import { useEffect, useState } from 'react'
import { faWater } from '@fortawesome/free-solid-svg-icons'
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import CardsOffers from '../../../UI/Cards/CardsOffers/CardsOffers'

export const OffersSect = () => {
  const [ofertas, setOfertas] = useState([])

  useEffect(() => {
    async function fetchCalentadores() {
      try {
        const res = await fetch('http://localhost:10101/ProductoGetAllCategoria?nombre_categoria=Ofertas');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setOfertas(data.data || []);
      } catch (error) {
        console.error(error)
      }
    }
    fetchCalentadores()
  }, [])

  return (
    <section id="OffersSect" className="NeoContainer_outset_TL flex flex-col p-[15px] gap-[20px]">
      <TitleSectCategory iconCategory={faWater} nameCategory="Ofertas" className='flex flex-row justify-start items-center gap-[8px]' />
      <CardsOffers
        uniqueId="offers"
        productos={ofertas}
      />
    </section>
  )
}

export default OffersSect;
