import React from 'react';
import { faWater } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../UI/TitleSectCategory/TitleSectCategory';
import Cards from '../../UI/Cards/Cards';

export const HeatersSect = () => {
    return (
        <section className='flex flex-col gap-[20px]'>
            <SectCategory iconCategory={faWater} nameCategory="Calentadores" className='flex flex-row justify-start items-center gap-[8px]' />
            <Cards uniqueId="heaters" titleCatt="Calentador" Price="999999" brandCatt="Oka" imgContent="https://armogas.com/wp-content/uploads/2024/06/calentador-8l-tn-mecanico-rheem-img-01.jpg"/>
        </section>
    );
};

export default HeatersSect;