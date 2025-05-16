import { SearchBarr } from "../../UI/Header/SearchBarr/SearchBarr"
import { Navs } from "../../UI/Header/Nav/Nav"
import { ProfilePhoto } from "../../UI/Header/ProfilePhoto/ProfilePhoto"
import { useState, useEffect } from 'react'
import './Header.css'

export const Header = () => {

    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div id="Header" className={`Header items-center w-[100%] h-fit sticky top-0 z-[10000] ${scrolled ? 'scrolled' : ''}`} >
            {scrolled ? <h2 className="flex justify-self-center font-bold text-4xl text-[var(--Font-Nav)]">Red Gas</h2> : ''}
            <SearchBarr />
            <Navs />
            <ProfilePhoto />
        </div>
    )
}

export default Header