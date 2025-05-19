import './TitleSectCategory.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export const TitleSectCategory = ({ iconCategory, nameCategory, className }) => {
    return (
        <div id='divTitle' className={`${className} NeoSubContainer_outset_TL p-[15px] w-fit`}>
            <FontAwesomeIcon icon={iconCategory} alt={nameCategory} className="iconCatt text-5xl " />
            <h2 className="titleCatt text-5xl font-semibold">{nameCategory}</h2>
        </div>
    )
}
export default TitleSectCategory