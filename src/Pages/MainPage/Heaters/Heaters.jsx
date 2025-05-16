import React, { useState, useEffect } from 'react';
import { faWater } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../../UI/TitleSectCategory/TitleSectCategory';
import Cards from '../../../UI/Cards/Cards';

export const HeatersSect = () => {
  const [calentadores, setCalentadores] = useState([]);

  useEffect(() => {
    async function fetchCalentadores() {
      try {
        const res = await fetch('http://localhost:10101/ProductoGetAll'); 
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setCalentadores(data.data || []); // data.data depende de cómo tu API responda
      } catch (error) {
        console.error(error);
      }
    }
    fetchCalentadores();
  }, []);

  return (
    <section id="HeatersSect" className="flex flex-col gap-[20px]">
      <SectCategory iconCategory={faWater} nameCategory="Calentadores" className='flex flex-row justify-start items-center gap-[8px]' />
      <Cards uniqueId="heaters" productos={calentadores} />
    </section>
  );
};

export default HeatersSect;
