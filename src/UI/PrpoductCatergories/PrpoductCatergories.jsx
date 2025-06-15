import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './PrpoductCatergories.css'

export const PrpoductCatergories = ({imgCategory, nameCategory, className, onClick}) => {
	return(
        <div tabIndex='0' onClick={onClick} className="cardCategory NeoSubContainer_outset_TL flex justify-center text-[var(--main-color)] items-center gap-[20px] !rounded-[10px] hover:!rounded-[18px] shadow_box cursor-pointer hover:text-[var(--Font-Nav)]">
            <FontAwesomeIcon icon={imgCategory} alt={nameCategory} style={className} className="icon text-2xl"/>
            <h3 className="text-2xl font-semibold">{nameCategory}</h3>
        </div>
    ) 
}
export default PrpoductCatergories
