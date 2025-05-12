import React from 'react';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../../UI/TitleSectCategory/TitleSectCategory';
import Cards from '../../../UI/Cards/Cards';

export const ToolsSect = () => {
    return (
        <section className='flex flex-col gap-[20px]'>
            <SectCategory iconCategory={faWrench} nameCategory="Herramientas" className='flex flex-row justify-start items-center gap-[8px]' />
            <Cards uniqueId="tools"  imgContent="https://greenforest.com.co/wp-content/uploads/2018/03/hombre-solo-e1735308449637.jpg"/>
        </section>
    );
};

export default ToolsSect;