
import { NavLink } from "react-router-dom"

export const BtnBack = ({To}) => {
    return (
        <NavLink to={To}>
            <button
                className="btnBack NeoContainer_outset_TL top-5 left-5 text-center w-40 h-10 absolute text-[var(--main-color)] text-[16px] font-semibold group"
                type="button"
            >
                <div
                    class="NeoSubContainer_outset_TL h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-38 group-hover:bg-[var(--main-color)] z-10 duration-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1024 1024"
                        height="25px"
                        width="25px"
                    >
                        <path
                            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                            fill="#323232"
                        ></path>
                        <path
                            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                            fill="#323232"
                        ></path>
                    </svg>
                </div>
                <p className="translate-x-2">Inicio</p>
            </button>
        </NavLink>

    )
}
export default BtnBack