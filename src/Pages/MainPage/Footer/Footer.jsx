import Logo from '../../../assets/Images/Redgas.png'
import { useNavigate } from "react-router-dom"

export const Footer = () => {
    const navigate = useNavigate()
    return (
        <footer className="footer py-20 px-1.5 h-350px bg-[var(--main-color)] text-white">
            <div className="flex flex-col items-center justify-center">
                <div className="items-center z-[2] flex flex-col gap-3 sm:max-w-md text-center">
                    <img src={Logo} className="w-32 sm:mx-auto" />
                    <p>
                        Protege tu hogar con productos de gas certificados y técnicos especializados.
                    </p>
                    <div className="items-center gap-3 space-y-3 flex-wrap flex justify-center">
                        <button
                            className="block py-2 px-4 text-center text-white font-medium bg-[var(--Font-Nav)] duration-150 hover:bg-[var(--Font-Nav-shadow)] active:bg-[var(--Font-Nav-shadow2)] rounded-lg shadow-lg hover:shadow-none"
                            onClick={() => navigate('/Register')}
                        >
                            Registrarse
                        </button>
                        <button
                            className="flex items-center justify-center gap-x-2 py-2 px-4 text-[var(--Font-Nav)] hover:text-[var(--Font-Nav-shadow)] font-medium duration-150 active:bg-[var(--Font-Nav-shadow2)] active:text-[var(--Font-Nav)] border rounded-lg md:inline-flex"
                            onClick={() => navigate('/Login')}
                        >
                            Iniciar sesión
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer