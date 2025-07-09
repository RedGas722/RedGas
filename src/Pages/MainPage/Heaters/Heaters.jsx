import { useEffect, useState } from 'react'
import { faWater } from '@fortawesome/free-solid-svg-icons'
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import { Cards } from '../../../UI/Cards/Cards'

export const HeatersSect = () => {
  const [calentadores, setCalentadores] = useState([])

  useEffect(() => {
    async function fetchCalentadores() {
      try {
        const res = await fetch('https://redgas.onrender.com/ProductoGetAllCategoria?nombre_categoria=Calentadores');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setCalentadores(data.data.data || []);
      } catch (error) {
        console.error(error)
      }
    }
    fetchCalentadores()
  }, [])

  return (
    <section id="HeatersSect" className="z-[2] NeoContainer_outset_TL h-auto !rounded-[40px] flex flex-col p-[15px] gap-[20px] text-[var(--Font-Nav)]">
      <TitleSectCategory IconClass='text-[var(--Font-Nav-shadow)]' iconCategory={faWater} nameCategory="Calentadores" className='flex flex-row justify-start items-center gap-[8px]' />
      <Cards
        uniqueId="heaters"
        productos={calentadores}
      />
    </section>
  )
}

export default HeatersSect;
