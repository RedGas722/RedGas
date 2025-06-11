import { useNavigate } from "react-router-dom"

export const BtnBack = ({ To }) => {
    const navigate = useNavigate()
    return (
        <>
            <button
                className="btnBack NeoContainer_outset_TL flex items-center justify-center justify-self-start self-start z-20 cursor-pointer text-center w-40 h-10 relative text-white text-[16px] font-semibold group"
                type="button"
                onClick={() => navigate(To)}
            >
                <div
                    className="NeoSubContainer_outset_TL h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-38 group-hover:bg-[var(--Font-Nav)] z-10 duration-500"
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
                <p className="text-[var(--main-color)] translate-x-2">Inicio</p>
            </button>
        </>

    )
}
export default BtnBack