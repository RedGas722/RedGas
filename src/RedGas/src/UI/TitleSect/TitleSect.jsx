// filepath: c:\Users\asusi\OneDrive\Escritorio\RedGas\src\UI\TitleSect\TitleSect.jsx
import React from 'react';
import './TitleSect.css';

export const TitleSect = ({ title, className }) => {
    return (
        <h2 className={`title-section ${className}`}>
            {title}
        </h2>
    );
};

export default TitleSect;