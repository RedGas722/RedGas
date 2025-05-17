import { faWater } from '@fortawesome/free-solid-svg-icons';
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import { Cards } from '../../../UI/Cards/Cards'

export const HeatersSect = () => {
    return (
        <section id="HeatersSect" className="NeoContainer_outset_TL flex flex-col p-[15px] gap-[20px]">
            <TitleSectCategory iconCategory={faWater} nameCategory="Calentadores" className='flex flex-row justify-start items-center gap-[8px]' />
            <Cards uniqueId="heaters" titleCatt="Calentador" Price="999999" brandCatt="Oka" imgContent="https://armogas.com/wp-content/uploads/2024/06/calentador-8l-tn-mecanico-rheem-img-01.jpg" />
        </section>
    );
};

export default HeatersSect;