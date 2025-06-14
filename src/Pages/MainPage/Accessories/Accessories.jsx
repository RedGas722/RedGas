import { useEffect, useState } from 'react';
import { faShower } from '@fortawesome/free-solid-svg-icons';
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import { Cards } from '../../../UI/Cards/Cards'

export const AccessoriesSect = () => {
    const [Accessories, seAccessories] = useState([]);

    useEffect(() => {
        async function fetchHerramientas() {
            try {
                const res = await fetch('https://redgas.onrender.com/ProductoGetAllCategoria?nombre_categoria=Accesorios');
                if (!res.ok) throw new Error('Error al obtener productos');
                const data = await res.json();
                seAccessories(data.data || []);
            } catch (error) {
                console.error(error);
            }
        }
        fetchHerramientas();
    }, []);

    return (
        <section id="AccessoriesSect" className="NeoContainer_outset_TL !rounded-[40px] flex flex-col p-[15px] gap-[20px] text-[var(--Font-Nav)]">
            <TitleSectCategory IconClass='text-[var(--Font-Nav-shadow)]' iconCategory={faShower} nameCategory="Accesorios" className='flex flex-row justify-start items-center gap-[8px]' />
            <Cards
                uniqueId="accessories"
                productos={Accessories}
            />
        </section>
    );
};

export default AccessoriesSect;
