import './Nav.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { Link } from 'react-scroll'
import { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { tabsClasses } from '@mui/material/Tabs'

export const Navs = ({ className, ref1, ref2, ref3, ref4 }) => {
    const [tipoUsuario, setTipoUsuario] = useState(null)
    const [tabIndex, setTabIndex] = useState(0)
    const navigate = useNavigate()

    const sectionIds = ['Hero', 'ProductCategory', 'OffersSect']

    useEffect(() => {
        const tipo = localStorage.getItem('tipo_usuario')
        setTipoUsuario(tipo ? parseInt(tipo) : null)
    }, [])

    // OBSERVADOR DE SCROLL PARA CAMBIAR EL TAB AUTOMÁTICAMENTE
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = sectionIds.indexOf(entry.target.id)
                        if (index !== -1) setTabIndex(index)
                    }
                })
            },
            {
                root: null,
                rootMargin: '-100px 0px 0px 0px',
                threshold: 0.6, // porcentaje visible para activar
            }
        )

        sectionIds.forEach(id => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
        switch (newValue) {
            case 0:
                document.getElementById('linkHero')?.click()
                break
            case 1:
                document.getElementById('linkProducts')?.click()
                break
            case 2:
                document.getElementById('linkOffers')?.click()
                break
            case 3:
                navigate('/Technic')
                break
            case 4:
                navigate('/CostumerServices')
                break
            case 5:
                navigate('/Admin')
                break
            default:
                break
        }
    }

    return (
        <Box
            className={className}
            sx={{
                flexGrow: 1,
                maxWidth: '100%',
                bgcolor: 'transparent',
            }}
        >
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                scrollButtons
                allowScrollButtonsMobile
                TabIndicatorProps={{
                    style: {
                        backgroundColor: '#19A9A4',
                        height: '3px',
                    },
                }}
                sx={{
                    [`& .${tabsClasses.scrollButtons}`]: {
                        '&.Mui-disabled': { opacity: 0.3 },
                    },
                    '& .MuiTab-root': {
                        color: 'inherit',
                    },
                    '& .Mui-selected': {
                        color: '#19A9A4 !important',
                    },
                }}
            >
                <Tab label="Inicio" />
                <Tab label="Productos" />
                <Tab label="Ofertas" />
                <Tab label="Técnicos" />
                <Tab label="Servi" />
                {(tipoUsuario === 1 || tipoUsuario === 3) && <Tab label="Admin" />}
            </Tabs>

            {/* LINKS OCULTOS PARA DISPARAR SCROLL */}
            <div className="hidden">
                <span ref={ref1}>
                    <Link id="linkHero" to="Hero" smooth={true} duration={500} offset={-90} />
                </span>
                <span ref={ref2}>
                    <Link id="linkProducts" to="ProductCategory" smooth={true} duration={500} offset={-130} />
                </span>
                <span ref={ref3}>
                    <Link id="linkOffers" to="OffersSect" smooth={true} duration={500} offset={-130} />
                </span>
                <span ref={ref4} />
            </div>
        </Box>
    )
}

export default Navs
