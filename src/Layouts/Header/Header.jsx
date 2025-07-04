import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SearchBarr } from "../../UI/Header/SearchBarr/SearchBarr"
import { Navs } from "../../UI/Header/Nav/Nav"
import useMediaQuery from '@mui/material/useMediaQuery'
import { jwtDecode } from "jwt-decode";
// import { ProfilePhoto } from "../../UI/Header/ProfilePhoto/ProfilePhoto"
import './Header.css'

export const Header = ({ classUser, classNavs }) => {
    const navigate = useNavigate();
    const [menuCount, setMenuCount] = useState(0);
    const type = localStorage.getItem('tipo_usuario')
    const rawToken = localStorage.getItem('token');
    let token = null;

    if (rawToken) {
        try {
            const decoded = jwtDecode(rawToken);
            const now = Date.now() / 1000;
            if (decoded.exp > now) {
                token = rawToken;
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('tipo_usuario');
            }
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('tipo_usuario');
        }
    }
    const [userName, setUserName] = useState('');
    const [productos, setProductos] = useState([]);
    const [scrolled, setScrolled] = useState(false)
    const [hamburger, setHamburger] = useState(false)
    const [isChecked, setIsChecked] = useState(true);

    const isDesktop = useMediaQuery('(min-width: 768px)');

    // Verificar si el usuario está autenticado
    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            const names = decoded.data.name.split(' ')
            const firstLetter = names[0].toUpperCase()

            if (firstLetter.length > 6) {
                const secondLetter = names[1].toUpperCase().slice(0, 1)
                setUserName(firstLetter.slice(0, 1) + secondLetter);
            } else {
                setUserName(firstLetter)
            }
        } else {
            setUserName('Iniciar')
        }


    }, [token]);

    // Cargar productos al iniciar
    useEffect(() => {
        const menuItems = document.querySelectorAll('.menu-container .menu-list');
        setMenuCount(menuItems.length);
    }, [token, type]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await fetch("https://redgas.onrender.com/ProductoGetAllNames");
                const data = await res.json();
                const productosData = data.data; // [{ id_producto, nombre_producto }]
                setProductos(productosData);
            } catch (error) {
                console.error("Error al cargar nombres de productos:", error);
            }
        };

        fetchProductos();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isDesktop && !hamburger) {
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
            if (!isDesktop) setScrolled(false);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleHamburger = () => {
        setHamburger(prev => {
            const newState = !prev;
            if (newState || !isDesktop) {
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
        localStorage.removeItem('tipo_usuario');
        window.location.href = '/';
    }

    // GSAP
    const headerRef = useRef(null)

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        if (hamburger) {
            gsap.set(el, { autoAlpha: 0, opacity: 0 });
            gsap.to(el, { autoAlpha: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
        }
    }, [hamburger]);



    return (
        <div ref={headerRef}
            id="Header"
            className={`Header w-[100%] h-fit md:sticky fixed left-0 top-0 z-[999] 
        ${scrolled && !hamburger && isDesktop ? `scrolled NeoContainer_outset_TL menu-${menuCount}` : ''} 
        ${hamburger ? 'Burguer w-fit NeoContainer_outset_TL' : ''}`}
        >
            {((!isDesktop && hamburger) || (isDesktop && scrolled)) && (
                <h2 className="justify-self-center flex font-bold text-4xl text-[var(--Font-Nav)]">
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
            <Navs className={`flex-1 items-center justify-center md:flex ${hamburger ? '' : 'hidden'} ${classNavs}`} />
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
                <section className={`menu-container bg-[var(--main-color)] text-[14px] ${classUser}`}>
                    {!token && (
                        <>
                            <div onClick={() => navigate('/Login')} className="menu-list">Iniciar Sesion</div>
                            <div onClick={() => navigate('/Register')} className="menu-list">Registro</div>
                        </>
                    )}

                    {token && type == 1 && (
                        <>
                            <div onClick={() => navigate('/Login')} className="menu-list">Cambiar Cuenta</div>
                            <div onClick={() => handSignOut()} className="menu-list">Cerrar Sesion</div>
                        </>
                    )}

                    {token && type == 2 && (
                        <>
                            <div onClick={() => navigate('/Login')} className="menu-list">Perfil</div>
                            <div onClick={() => navigate('/CostumerMyService')} className="menu-list">Mi Servicio</div>
                            <div onClick={() => navigate('/Login')} className="menu-list">Cambiar Cuenta</div>
                            <div onClick={() => handSignOut()} className="menu-list">Cerrar Sesion</div>
                        </>
                    )}

                    {token && type == 3 && (
                        <>
                            <div onClick={() => navigate('/Login')} className="menu-list">Cambiar Cuenta</div>
                            <div onClick={() => handSignOut()} className="menu-list">Cerrar Sesion</div>
                        </>
                    )}

                    {token && type == 4 && (
                        <>
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
