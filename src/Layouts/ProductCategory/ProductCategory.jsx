import React from "react"
import PrpoductCatergories from "../../UI/PrpoductCatergories/PrpoductCatergories"
import './ProductCategory.css'
import { faWater } from '@fortawesome/free-solid-svg-icons'
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faShower } from '@fortawesome/free-solid-svg-icons';


export const ProductCategory = () => {
	return(
            <section className="cardCategoryContainer " >
                <PrpoductCatergories imgCategory={faWater} nameCategory="Calentadores" />
                <PrpoductCatergories imgCategory={faWrench} nameCategory="Herramientas" />
                <PrpoductCatergories imgCategory={faGear} nameCategory="Repuestos" />
                <PrpoductCatergories imgCategory={faShower} nameCategory="Accesorios" />
            </section>
    ) 
}
export default ProductCategory
