import React from "react"
import PrpoductCatergories from "../../UI/PrpoductCatergories/PrpoductCatergories"
import { faWater } from '@fortawesome/free-solid-svg-icons'


export const ProductCategory = () => {
	return(
        <>
            <section className="flex justify-between flex-wrap items-center gap-[20px]">
                <PrpoductCatergories imgCategory={faWater} nameCategory="Category 1" />
                <PrpoductCatergories imgCategory="/img/Category2.png" nameCategory="Category 2" />
                <PrpoductCatergories imgCategory="/img/Category3.png" nameCategory="Category 3" />
                <PrpoductCatergories imgCategory="/img/Category4.png" nameCategory="Category 4" />
            </section>
        </>
    ) 
}
export default ProductCategory
