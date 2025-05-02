import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './PrpoductCatergories.css'

export const PrpoductCatergories = ({imgCategory, nameCategory, className}) => {
	return(
        <div tabIndex='0' className="cardCategory bg-glass-total flex justify-center items-center gap-[20px] rounded-[20px] shadow_box cursor-pointer">
            <FontAwesomeIcon icon={imgCategory} alt={nameCategory} style={className} className="text-white text-2xl"/>
            <h3 className="text-2xl text-white font-semibold">{nameCategory}</h3>
        </div>
    ) 
}
export default PrpoductCatergories
