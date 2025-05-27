import { useEffect, useState } from 'react';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import { Cards } from '../../../UI/Cards/Cards'

export const ToolsSect = () => {
  const [herramientas, setHerramientas] = useState([]);

  useEffect(() => {
    async function fetchHerramientas() {
      try {
        const res = await fetch('http://localhost:10101/ProductoGetAllCategoria?nombre_categoria=Herramientas');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setHerramientas(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchHerramientas();
  }, []);

  return (
    <section id="ToolsSect" className="NeoContainer_outset_TL flex flex-col p-[15px] gap-[20px] text-[var(--Font-Nav)]">
      <TitleSectCategory iconCategory={faWrench} nameCategory="Herramientas" className='flex flex-row justify-start items-center gap-[8px]' />
      <Cards
        uniqueId="tools"
        productos={herramientas}
      />
    </section>
  );
};

export default ToolsSect;
