import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, use } from 'react';
import { gsap } from 'gsap';
import { SearchBarr } from "../../UI/Header/SearchBarr/SearchBarr"
import { Navs } from "../../UI/Header/Nav/Nav"
import { jwtDecode } from "jwt-decode";
import './Header.css'

export const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [userName, setUserName] = useState('');
    const [productos, setProductos] = useState([]);
    const [scrolled, setScrolled] = useState(false)
    const [hamburger, setHamburger] = useState(false)
    const [isChecked, setIsChecked] = useState(true);

    const isDesktop = () => window.innerWidth >= 768;

    // Verificar si el usuario está autenticado
    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            const names = decoded.data.name.split(' ')
            const firstLetter = names[0].toUpperCase()
            console.log(firstLetter.length);


            if (firstLetter.length > 6) {
                const secondLetter = names[1].toUpperCase().slice(0, 1)
                setUserName(firstLetter.slice(0, 1) + secondLetter);
            } else {
                setUserName(firstLetter)
            }
        } else {
            setUserName('Iniciar')
        }


    }, []);

    // Cargar productos al iniciar
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await fetch("https://redgas.onrender.com/ProductoGetAll");
                const data = await res.json();
                const productosData = data.data.productos;
                setProductos(productosData);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };

        fetchProductos();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isDesktop() && !hamburger) {
                setScrolled(window.scrollY > 50);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hamburger]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;
            // Solo cierra si se hace clic FUERA del botón y del menú hamburguesa y del menú desplegable
            if (
                !target.closest(".menu-btn") &&
                !target.closest(".Header.Burguer") &&
                !target.closest(".main") // <- evita cerrar al hacer clic en el menú desplegable
            ) {
                setHamburger(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (!isDesktop()) setScrolled(false);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleHamburger = () => {
        setHamburger(prev => {
            const newState = !prev;
            if (newState || !isDesktop()) {
                setScrolled(false);
            }
            return newState;
        });
    };


    const handleToggle = () => {
        setIsChecked(prev => !prev)
    }

    const handSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tipo_usuario')
        window.location.href = '/';
    }

    // GSAP
    const headerRef = useRef(null)
    const navRef1 = useRef(null)
    const navRef2 = useRef(null)
    const navRef3 = useRef(null)
    const navRef4 = useRef(null)

    useEffect(() => {
        if (hamburger) {
            const tl = gsap.timeline({ defaults: { ease: 'back.in', duration: 0.3 } })

            tl.fromTo(headerRef.current, { scale: 0.92 }, { scale: 1 })
                .fromTo(navRef1.current, { x: -200, opacity: 0 }, { x: 0, opacity: 1 })
                .fromTo(navRef2.current, { x: -300, opacity: 0 }, { x: 0, opacity: 1 })
                .fromTo(navRef3.current, { x: -400, opacity: 0 }, { x: 0, opacity: 1 })
                .fromTo(navRef4.current, { x: -500, opacity: 0 }, { x: 0, opacity: 1 })
                .fromTo(navRef5.current, { x: -600, opacity: 0 }, { x: 0, opacity: 1 })
        }
    }, [hamburger]);

    return (
        <div ref={headerRef}
            id="Header"
            className={`Header w-[100%] h-fit md:sticky fixed left-0 top-0 z-[10000] ${(scrolled && !hamburger && isDesktop()) ? 'scrolled NeoContainer_outset_TL' : ''} ${hamburger ? 'Burguer w-fit NeoContainer_outset_TL' : ''}`}
        >
            {(scrolled && !hamburger && isDesktop()) && (
                <h2 className="justify-self-center hidden md:flex font-bold text-4xl text-[var(--Font-Nav)]">
                    Red Gas
                </h2>
            )}

            <div className="flex items-center justify-between py-5 md:hidden">
                <div className="md:hidden">
                    <input
                        id="burger-checkbox"
                        type="checkbox"
                        className="hidden"
                        checked={hamburger}
                        onChange={toggleHamburger}
                    />
                    <label
                        htmlFor="burger-checkbox"
                        className="burger fixed top-5 left-2 z-[1000] flex flex-col gap-[6px] cursor-pointer"
                    >
                        <span className="bg-[var(--main-color-sub)]"></span>
                        <span className="bg-[var(--main-color-sub)]"></span>
                        <span className="bg-[var(--main-color-sub)]"></span>
                    </label>
                </div>
            </div>

            {/* Aquí enviamos productos a la barra de búsqueda */}
            <SearchBarr productos={productos} className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'}`} />
            <Navs ref1={navRef1} ref2={navRef2} ref3={navRef3} ref4={navRef4} className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'}`} />
            {/* <ProfilePhoto className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'}`} /> */}
            <label className={`dropdown flex-1 flex justify-self-end items-center text-[var(--Font-Nav)] justify-between md:flex ${hamburger ? '' : 'hidden'}`} >
                {userName}
                <input
                    className="inp"
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleToggle}
                />
                <div className="bar">
                    <span className="top bar-list"></span>
                    <span className="middle bar-list"></span>
                    <span className="bottom bar-list"></span>
                </div>
                <section className="menu-container bg-[var(--main-color)] text-white text-[14px]">
                    {!token && (
                        <>
                            <div onClick={() => navigate('/Login')} className="menu-list">Iniciar Sesion</div>
                            <div onClick={() => navigate('/Register')} className="menu-list">Registro</div>
                        </>
                    )}

                    {token && (
                        <>
                            <div onClick={() => navigate('/Login')} className="menu-list">Perfil</div>
                            <div onClick={() => navigate('/CostumerMyServices')} className="menu-list">Mi Servicio</div>
                            <div onClick={() => navigate('/Shopping')} className="menu-list">Carrito</div>
                            <div onClick={() => navigate('/Login')} className="menu-list">Cambiar Cuenta</div>
                            <div onClick={() => handSignOut()} className="menu-list">Cerrar Sesion</div>
                        </>
                    )}
                </section>
            </label>
        </div>
    );
};

export default Header;
