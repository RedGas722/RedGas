import { SearchBarr } from "../../UI/Header/SearchBarr/SearchBarr"
import { Navs } from "../../UI/Header/Nav/Nav"
import { ProfilePhoto } from "../../UI/Header/ProfilePhoto/ProfilePhoto"
import { useState, useEffect } from 'react'
import './Header.css'

export const Header = () => {
    const [scrolled, setScrolled] = useState(false)
    const [hamburger, setHamburger] = useState(false)

    const isDesktop = () => window.innerWidth >= 768

    useEffect(() => {
        const handleScroll = () => {
            if (isDesktop() && !hamburger) {
                setScrolled(window.scrollY > 50)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [hamburger])

    useEffect(() => {
        // Cierra el menú al hacer clic fuera
        document.onclick = (e) => {
            const target = e.target
            if (!target.closest(".menu-btn")) setHamburger(false)
        }
    }, [])

    useEffect(() => {
        // Si cambia el tamaño de pantalla y se vuelve móvil, quitar scroll effect
        const handleResize = () => {
            if (!isDesktop()) setScrolled(false)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleHamburger = () => {
        setHamburger(prev => {
            const newState = !prev
            if (newState || !isDesktop()) {
                setScrolled(false)
            }
            return newState
        })
    }

    return (
        <div
            id="Header"
            className={`Header w-[100%] h-fit md:sticky fixed left-0 top-0 z-[10000] ${
                (scrolled && !hamburger && isDesktop()) ? 'scrolled NeoContainer_outset_TL' : ''
            } ${hamburger ? 'Burguer w-fit NeoContainer_outset_TL' : ''}`}
        >
            {(scrolled && !hamburger && isDesktop()) && (
                <h2 className="justify-self-center hidden md:flex font-bold text-4xl text-[var(--Font-Nav)]">
                    Red Gas
                </h2>
            )}

            <div className="flex items-center justify-between py-5 md:hidden">
                <div className="md:hidden">
                    <button
                        className="menu-btn text-[var(--main-color-sub)] fixed top-5 left-2 w-fit hover:text-[var(--main-color)]"
                        onClick={toggleHamburger}
                    >
                        {hamburger ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <SearchBarr className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'}`} />
            <Navs className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'}`} />
            <ProfilePhoto className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'}`} />
        </div>
    )
}

export default Header
