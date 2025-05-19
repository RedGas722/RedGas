import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { TitleSectCategory } from '../../../UI/TitleSectCategory/TitleSectCategory'
import { Cards } from '../../../UI/Cards/Cards'

export const ToolsSect = () => {
    return (
        <section className='NeoContainer_outset_TL flex flex-col p-[15px] gap-[20px]'>
            <TitleSectCategory iconCategory={faWrench} nameCategory="Herramientas" className='flex flex-row justify-start items-center gap-[8px]' />
            <Cards uniqueId="tools" titleCatt='Llave' brandCatt='CAT' imgContent="https://greenforest.com.co/wp-content/uploads/2018/03/hombre-solo-e1735308449637.jpg" />
        </section>
    );
};

export default ToolsSect;