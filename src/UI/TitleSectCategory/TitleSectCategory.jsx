import React from 'react'
import './TitleSectCategory.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const TitleSectCategory = ({ imgCategory, nameCategory, className }) => {
    return (
        <div id='divTitle' className={className}>
            <FontAwesomeIcon icon={imgCategory} alt={nameCategory} className="iconCatt text-5xl "  />
            <h2 className="titleCatt text-5xl font-semibold">{nameCategory}</h2>
        </div>
    )
}
export default TitleSectCategory