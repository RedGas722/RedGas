import { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { Link } from 'react-scroll'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { tabsClasses } from '@mui/material/Tabs' 
import useMediaQuery from '@mui/material/useMediaQuery'
import { jwtDecode } from 'jwt-decode'

export const  Navs = ({ className, ref1, ref2, ref3, ref4 }) => {
    const [tipoUsuario, setTipoUsuario] = useState(null)
    const [tabIndex, setTabIndex] = useState(0)
    const navigate = useNavigate()
    const sectionIds = ['Hero', 'OffersSect', 'AllProduct']

    const isMdUp = useMediaQuery('(min-width: 768px)')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token){
            const decoded = jwtDecode(token)
            const tipo = decoded?.data?.tipo_usuario
            setTipoUsuario(tipo ? parseInt(tipo) : null)
        }
    }, [])

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
                rootMargin: '-100px 0px 0px 0px',
                threshold: isMdUp ? 0.2 : 0.05,
            }
        )

        sectionIds.forEach(id => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [isMdUp])

    const generateTabs = () => {
        const baseTabs = [
            { label: 'Inicio', action: () => document.getElementById('linkHero')?.click() },
            { label: 'Ofertas', action: () => document.getElementById('linkOffers')?.click() },
            { label: 'Productos', action: () => document.getElementById('linkMainPage')?.click() },
        ]

        if (tipoUsuario === 1 || tipoUsuario === 3) {
            baseTabs.push({ label: 'Admin', action: () => navigate('/Admin') })
        }

        if (tipoUsuario === 4) {
            baseTabs.push({ label: 'Servicios', action: () => navigate('/CostumerServices')?.click() });
        }
        return baseTabs
    }

    const tabOptions = generateTabs()

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
        const selectedTab = tabOptions[newValue]
        if (selectedTab && typeof selectedTab.action === 'function') {
            selectedTab.action()
        }
    }

    return (
        <Box
            className={`w-full flex ${isMdUp ? 'flex-row' : 'flex-col'} ${className}`}
            sx={{
                flexGrow: 1,
                maxWidth: '100%',
                bgcolor: 'transparent',
            }}
        >
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                orientation={isMdUp ? 'horizontal' : 'vertical'}
                scrollButtons
                allowScrollButtonsMobile
                TabIndicatorProps={{
                    style: {
                        backgroundColor: 'var(--Font-Nav)',
                        height: isMdUp ? '3px' : '100%',
                        width: isMdUp ? 'auto' : '3px',
                        left: isMdUp ? undefined : 0,
                        right: isMdUp ? 0 : 'auto',
                    },
                }}
                sx={{
                    [`& .${tabsClasses.scrollButtons}`]: {
                        '&.Mui-disabled': { opacity: 0.3 },
                    },
                    '& .MuiTab-root': {
                        color: 'var(--main-color)',
                        borderBottom: isMdUp ? '3px solid transparent' : 'none',
                        borderLeft: !isMdUp ? 'none' : 'none',
                        '&.Mui-selected': {
                            color: 'var(--Font-Nav)',
                            borderRadius: isMdUp ? '0 0 3px 3px' : '3px 0 0 3px',
                            borderBottom: isMdUp ? '3px solid var(--Font-Nav)' : 'none',
                            borderLeft: !isMdUp ? 'none' : 'none',
                        },
                        '&:hover': {
                            color: 'var(--Font-Nav-shadow)',
                            '&.Mui-selected': {
                                color: 'var(--Font-Nav)',
                            }
                        }
                    },
                }}
            >
                {tabOptions.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>

            {/* LINKS OCULTOS PARA DISPARAR SCROLL */}
            <div className="hidden">
                <span ref={ref1}>
                    <Link id="linkHero" to="Hero" smooth={true} duration={500} offset={-900} />
                </span>
                <span ref={ref2}>
                    <Link id="linkOffers" to="OffersSect" smooth={true} duration={500} offset={-130} />
                </span>
                <span ref={ref3}>
                    <Link id="linkMainPage" to="AllProduct" smooth={true} duration={500} offset={-130} />
                </span>
                <span ref={ref4}>
                    <NavLink id="linkM" to="/Services" />
                </span>
                <span ref={ref4} />
            </div>
        </Box>
    )
}

export default Navs
