// filepath: c:\Users\asusi\OneDrive\Escritorio\RedGas\src\UI\Header\Nav\Nav.jsx
import React from 'react';
import LinksNav from '../../Links/LinksNav';

export const Navs = () => {
    return (
        <div className="flex gap-[10%] flex-wrap text-center justify-center text-[20px] items-center">  
            <LinksNav route="/" child="Inicio" className="text-[var(--Font-Nav)] font-bold" />
            <LinksNav route="/offers" child="Ofertas" className="text-white" />
            <LinksNav route="/products" child="Productos" className="text-white" /> 
            <LinksNav route="/technicians" child="Tecnicos" className="text-white" /> 
        </div>
    );
}

export default Navs;