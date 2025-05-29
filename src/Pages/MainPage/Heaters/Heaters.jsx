import { useEffect, useState } from 'react'
import { faWater } from '@fortawesome/free-solid-svg-icons'
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import { Cards } from '../../../UI/Cards/Cards'

export const HeatersSect = () => {
  const [calentadores, setCalentadores] = useState([])

  useEffect(() => {
    async function fetchCalentadores() {
      try {
        const res = await fetch('http://localhost:10101/ProductoGetAllCategoria?nombre_categoria=Calentadores');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setCalentadores(data.data || []);
      } catch (error) {
        console.error(error)
      }
    }
    fetchCalentadores()
  }, [])

  return (
    <section id="HeatersSect" className="NeoContainer_outset_TL flex flex-col p-[15px] gap-[20px]">
      <TitleSectCategory iconCategory={faWater} nameCategory="Calentadores" className='flex flex-row justify-start items-center gap-[8px]' />
      <Cards
        uniqueId="heaters"
        productos={calentadores}
      />
    </section>
  )
}

export default HeatersSect;
