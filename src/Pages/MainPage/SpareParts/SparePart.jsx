import { useEffect, useState } from 'react'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import { Cards } from '../../../UI/Cards/Cards'

export const SpaerPartsSect = () => {
    const [spareparts, setSpareparts] = useState([])

    useEffect(() => {
        async function fetchHerramientas() {
            try {
                const res = await fetch('https://redgas.onrender.com/ProductoGetAllCategoria?nombre_categoria=Repuestos')
                if (!res.ok) throw new Error('Error al obtener productos')
                const data = await res.json()
                setSpareparts((data.data.data || []).filter(p => p.stock > 0))
            } catch (error) {
                console.error(error)
            }
        }
        fetchHerramientas()
    }, [])

    return (
        <section id="SpareSect" className="z-[2] NeoContainer_outset_TL !rounded-[40px] flex flex-col p-[15px] gap-[20px] text-[var(--Font-Nav)]">
            <TitleSectCategory IconClass='text-[var(--Font-Nav-shadow)]' iconCategory={faGear} nameCategory="Repuestos" className='flex flex-row justify-start items-center gap-[8px]' />
            <Cards
                uniqueId="spareparts"
                productos={spareparts}
            />
        </section>
    )
}

export default SpaerPartsSect