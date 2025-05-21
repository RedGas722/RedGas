import "./ShopCart.css"
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"

export const ShopCart = () => {
	return (
		<NavLink to='/Shopping'>
			<section className="cards_shadow clip-path-shop-cart2 w-fit  text-white flex justify-center items-center ">
				<div className="clip-path-shop-cart flex justify-center items-center gap-[5px]">
					<FontAwesomeIcon
						icon={faCartShopping}
						alt="Carrito de compras"
					/>
					<h3 className="font-semibold">999</h3>
				</div>
			</section>
		</NavLink>
	)
}
export default ShopCart