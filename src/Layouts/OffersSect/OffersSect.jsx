import React from 'react'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../UI/TitleSectCategory/TitleSectCategory';
import Cards from '../../UI/Cards/Cards';


export const OffersSect = () => {
    return (
        <>
            <SectCategory imgCategory={faDollarSign} nameCategory="Oferta" className='flex flex-row-reverse justify-end items-center'/>
                <Cards />
        </>
    )
}
export default OffersSect