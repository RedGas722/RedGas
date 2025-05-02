import React from 'react';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import SectCategory from '../../UI/TitleSectCategory/TitleSectCategory';
import Cards from '../../UI/Cards/Cards';

export const ToolsSect = () => {
    return (
        <section className='flex flex-col gap-[20px]'>
            <SectCategory iconCategory={faWrench} nameCategory="Herramientas" className='flex flex-row justify-start items-center gap-[8px]' />
            <Cards uniqueId="tools" />
        </section>
    );
};

export default ToolsSect;