import SearchBarr from "../../UI/Header/SearchBarr/SearchBarr";
import Navs from "../../UI/Header/Nav/Nav";
import ProfilePhoto from "../../UI/Header/ProfilePhoto/ProfilePhoto";
import Logo from '../../assets/Images/red_gas.webp'
import React, { useState, useEffect } from 'react';
import './Header.css'

export const Header = () => {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50); // cambia a true si bajaste más de 50px
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div id="Header" className={`Header items-center w-[100%] h-fit sticky top-0 z-[10000] ${scrolled ? 'scrolled' : ''}`} >
            {scrolled ? <img src={Logo} className="w-[50px] flex justify-self-center" /> : ''}
            <SearchBarr />
            <Navs />
            <ProfilePhoto />
        </div>
    )
}

export default Header;