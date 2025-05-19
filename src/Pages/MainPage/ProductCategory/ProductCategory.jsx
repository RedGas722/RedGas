import { faWater } from '@fortawesome/free-solid-svg-icons'
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faShower } from '@fortawesome/free-solid-svg-icons';
import './ProductCategory.css'
import { PrpoductCatergories } from "../../../UI/PrpoductCatergories/PrpoductCatergories"


export const ProductCategory = () => {
    return (
        <section id="ProductCategory" className="NeoContainer_outset_TL cardCategoryContainer p-[30px]">
            <PrpoductCatergories imgCategory={faWater} nameCategory="Calentadores" />
            <PrpoductCatergories imgCategory={faWrench} nameCategory="Herramientas" />
            <PrpoductCatergories imgCategory={faGear} nameCategory="Repuestos" />
            <PrpoductCatergories imgCategory={faShower} nameCategory="Accesorios" />
        </section>
    )
}
export default ProductCategory
