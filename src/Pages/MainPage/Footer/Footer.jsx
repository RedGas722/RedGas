import Logo from '../../../assets/Images/Redgas.webp'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Link } from 'react-scroll'
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Buttons } from '../../../UI/Login_Register/Buttons'

export const Footer = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const Contact = () => {
        return (
            <div className='text-white flex flex-col gap-4 z-[2]'>
                <h3 className='text-2xl font-bold'>Contáctanos</h3>
                <div className='pl-[8px]'>
                    <div>
                        <p className='flex gap-2'><span><FontAwesomeIcon icon={faEnvelope} className='text-[var(--Font-Nav)]' /></span> john@doe.com </p>
                    </div>
                    <div>
                        <p className='flex gap-2'><span><FontAwesomeIcon icon={faPhone} className='text-[var(--Font-Nav)]' /></span> 3101234567 </p>
                    </div>
                    <div>
                        <p className='flex gap-2'><span><FontAwesomeIcon icon={faLocationDot} className='text-[var(--Font-Nav)]' /></span> 1823 Cra. 21, Armenia, Quindío </p>
                    </div>
                </div>
            </div>
        )
    }

    const Reserved = () => {
        return (
            <div className="p-[20px_0] border-t z-[2] w-[98%] self-center border-[var(--main-color-sub)] text-white items-center justify-center sm:flex">
                <p>© 2025 RedGas.</p>
            </div>
        )
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    if (isLoggedIn) {
        return (
            <footer className="footer pt-20 px-1.5 flex flex-col gap-20 h-350px bg-[var(--main-color)]">
                <div className='flex items-end justify-center flex-wrap gap-4 lg:gap-80'>
                    <div className='items-center z-[2] flex flex-col gap-3 sm:max-w-md text-center text-white'>
                        <img src={Logo} className="w-32 sm:mx-auto" />
                        <h1 className='text-3xl sm:text-4xl text-center font-bold text-[var(--Font-Nav)]'>RedGas</h1>

                        <p className="text-lg font-bold">Bienvenido de nuevo!</p>
                        <Link id="linkHero" to="Hero" smooth={true} duration={500} offset={-900} >
                            <Buttons
                                nameButton='Volver al inicio'
                                shadow='none'
                                shadowActive='none'
                                radius='10'
                                borderWidth='1'
                                borderColor='var(--Font-Nav2)'
                                textColor='var(--main-color)'
                            />
                        </Link>
                        <p className="text-sm">Gracias por confiar en RedGas.</p>
                    </div>
                    {
                        Contact()
                    }
                </div>
                {
                    Reserved()
                }
            </footer>
        );
    }

    return (
        <footer className="footer pt-20 px-1.5 flex flex-col gap-20 h-350px bg-[var(--main-color)]">
            <div className="flex items-end justify-center flex-wrap gap-4 lg:gap-80">
                <div className="items-center z-[2] flex flex-col gap-3 sm:max-w-md text-center text-white">
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
                {
                    Contact()
                }
            </div>
            {
                Reserved()
            }
        </footer>
    );
}