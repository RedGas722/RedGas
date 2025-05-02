// filepath: c:\Users\asusi\OneDrive\Escritorio\RedGas\src\Layouts\Offers\Offers.jsx
import React from 'react';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../UI/TitleSectCategory/TitleSectCategory';
import Cards from '../../UI/Cards/Cards';

export const OffersSect = () => {
    return (
        <section className='flex flex-col gap-[20px]'>
            <SectCategory iconCategory={faDollarSign} nameCategory="Oferta" className='flex flex-row-reverse justify-end items-center' />
            <Cards />
        </section>
    );
};

export default OffersSect;