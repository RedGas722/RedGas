// filepath: c:\Users\asusi\OneDrive\Escritorio\RedGas\src\Layouts\Heaters\Heaters.jsx
import React from 'react';
import { faWater } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../UI/TitleSectCategory/TitleSectCategory';
import Cards from '../../UI/Cards/Cards';

export const HeatersSect = () => {
    return (
        <section className='flex flex-col gap-[20px]'>
            <SectCategory iconCategory={faWater} nameCategory="Calentadores" className='flex flex-row justify-start items-center gap-[8px]' />
            <Cards />
        </section>
    );
};

export default HeatersSect;