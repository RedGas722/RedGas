import React from "react";
import PrpoductCatergories from "../../UI/PrpoductCatergories/PrpoductCatergories";
import './ProductCategory.css';

const productCategories = [
    { imgCategory: 'faWater', nameCategory: "Calentadores" },
    { imgCategory: 'faWrench', nameCategory: "Herramientas" },
    { imgCategory: 'faGear', nameCategory: "Repuestos" },
    { imgCategory: 'faShower', nameCategory: "Accesorios" },
];

export const ProductCategory = () => {
    return (
        <section className="cardCategoryContainer">
            {productCategories.map((category, index) => (
                <PrpoductCatergories key={index} imgCategory={category.imgCategory} nameCategory={category.nameCategory} />
            ))}
        </section>
    );
};

export default ProductCategory;