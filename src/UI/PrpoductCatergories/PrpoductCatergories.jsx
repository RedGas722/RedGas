import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const PrpoductCatergories = ({imgCategory, nameCategory, className}) => {
	return(
    <section>
        <div className="bg-glass-total flex justify-center items-center gap-[20px] rounded-[20px] w-[300px] h-[140px] shadow_box">
            <FontAwesomeIcon icon={imgCategory} alt={nameCategory} style={className} className="text-white text-2xl"/>
            <h3 className="text-2xl text-white font-semibold">{nameCategory}</h3>
        </div>
    </section>
    ) 
};
export default PrpoductCatergories;
