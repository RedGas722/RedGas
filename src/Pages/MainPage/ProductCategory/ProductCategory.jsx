import { faWater, faWrench, faGear, faShower } from '@fortawesome/free-solid-svg-icons';
import './ProductCategory.css';
import { PrpoductCatergories } from "../../../UI/PrpoductCatergories/PrpoductCatergories";
import { useNavigate } from 'react-router-dom';

export const ProductCategory = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/SearchPage?category=${category}`);
    }

    return (
        <section id="ProductCategory" className="NeoContainer_outset_TL cardCategoryContainer p-[30px]">
            <div onClick={() => handleCategoryClick("Calentadores")}>
                <PrpoductCatergories imgCategory={faWater} nameCategory="Calentadores" />
            </div>
            <div onClick={() => handleCategoryClick("Herramientas")}>
                <PrpoductCatergories imgCategory={faWrench} nameCategory="Herramientas" />
            </div>
            <div onClick={() => handleCategoryClick("Repuestos")}>
                <PrpoductCatergories imgCategory={faGear} nameCategory="Repuestos" />
            </div>
            <div onClick={() => handleCategoryClick("Accesorios")}>
                <PrpoductCatergories imgCategory={faShower} nameCategory="Accesorios" />
            </div>
        </section>
    )
}
export default ProductCategory;
