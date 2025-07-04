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
        <section id="ProductCategory" className="z-[2] NeoContainer_outset_TL !rounded-[40px] cardCategoryContainer p-[30px]">
                <PrpoductCatergories imgCategory={faWater} onClick={() => handleCategoryClick("Calentadores")} nameCategory="Calentadores" />
                <PrpoductCatergories imgCategory={faWrench} onClick={() => handleCategoryClick("Herramientas")} nameCategory="Herramientas" />
                <PrpoductCatergories imgCategory={faGear} onClick={() => handleCategoryClick("Repuestos")} nameCategory="Repuestos" />
                <PrpoductCatergories imgCategory={faShower} onClick={() => handleCategoryClick("Accesorios")} nameCategory="Accesorios" />
        </section>
    )
}
export default ProductCategory;
