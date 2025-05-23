import { SearchBarr } from "../../UI/Header/SearchBarr/SearchBarr"
import { Navs } from "../../UI/Header/Nav/Nav"
import { ProfilePhoto } from "../../UI/Header/ProfilePhoto/ProfilePhoto"
import { useState, useEffect } from 'react'
import './Header.css'

export const Header = () => {

    const [scrolled, setScrolled] = useState(false)
    const [hamburger, sethamburger] = useState(false)

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) sethamburger(false);
        };
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <div id="Header" className={`Header w-[100%] h-fit md:sticky fixed left-0 top-0 z-[10000] ${scrolled ? 'scrolled' : ''}  ${hamburger ? 'Burguer NeoContainer_outset_TL' : ''}`}>
                {scrolled ? <h2 className={`justify-self-center hidden md:flex font-bold text-4xl text-[var(--Font-Nav)] ${hamburger ? 'hidden' : ''}`}>Red Gas</h2> : ''}
                <div className="flex items-center justify-between py-5 md:hidden">
                    <div className="md:hidden">
                        <button className="menu-btn text-[var(--main-color-sub)] fixed top-5 left-2 w-fit hover:text-[var(--main-color)]"
                            onClick={() => sethamburger(!hamburger)}
                        >
                            {
                                hamburger ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>

                <SearchBarr className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'}`} />
                
                <Navs className={`flex-1  items-center justify-center md:flex  ${hamburger ? '' : 'hidden'}`} />

                <ProfilePhoto className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'}`} />
                {/* </div> */}
            </div>
        </>
    )
}

export default Header

// import { useEffect, useState } from 'react'

// export default () => {

//     const [state, setState] = useState(false)

//     // Replace javascript:void(0) paths with your paths
//     const navigation = [
//         { title: "Features", path: "javascript:void(0)" },
//         { title: "Integrations", path: "javascript:void(0)" },
//         { title: "Customers", path: "javascript:void(0)" },
//         { title: "Pricing", path: "javascript:void(0)" }
//     ]

//     useEffect(() => {
//         document.onclick = (e) => {
//             const target = e.target;
//             if (!target.closest(".menu-btn")) setState(false);
//         };
//     }, [])

//     return (

//     )
// }