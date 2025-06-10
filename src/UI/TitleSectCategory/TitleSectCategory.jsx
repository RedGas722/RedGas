import './TitleSectCategory.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export const TitleSectCategory = ({ iconCategory, nameCategory, className, IconClass }) => {
    return (
        <div id='divTitle' className={`${className} p-[15px] w-fit font-[400]`}>
            <FontAwesomeIcon icon={iconCategory} alt={nameCategory} className={`iconCatt ${IconClass}`} />
            <h2 className="titleCatt ">{nameCategory}</h2>
        </div>
    )
}
export default TitleSectCategory