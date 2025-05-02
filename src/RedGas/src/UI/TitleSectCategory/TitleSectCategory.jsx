// filepath: c:\Users\asusi\OneDrive\Escritorio\RedGas\src\UI\TitleSectCategory\TitleSectCategory.jsx
import React from 'react';
import './TitleSectCategory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const TitleSectCategory = ({ iconCategory, nameCategory, className }) => {
    return (
        <div id='divTitle' className={className}>
            <FontAwesomeIcon icon={iconCategory} alt={nameCategory} className="iconCatt text-5xl " />
            <h2 className="titleCatt text-5xl font-semibold">{nameCategory}</h2>
        </div>
    );
};

export default TitleSectCategory;