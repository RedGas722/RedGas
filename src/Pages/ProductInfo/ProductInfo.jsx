import './ProductInfo.css'
import BtnBack from "../../UI/Login_Register/BtnBack"

export const ProductInfo = () => {
    return (
        <div className='InfoContainer'>
            <BtnBack To='/' />
            <section className="MainPageContainer h-dvh">
                <div className="NeoContainer_outset_TL flex flex-col justify-center items-center w-full h-dvh md:h-[75%] p-[20px]">
                    <h1 className="text-[var(--main-color)] text-center text-[30px] font-bold">Información del Producto</h1>
                </div>
            </section>
        </div>
    )
}
export default ProductInfo