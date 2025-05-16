import React from 'react'

export const TitleSect = ({child, className}) => {
    return (
        <>
            <h2 style={className}>{child}</h2>
        </>
    )
}
export default TitleSect
