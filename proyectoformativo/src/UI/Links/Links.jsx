import { NavLink } from 'react-router-dom'

export const Links = ({route, child, style}) => {
    return (
        <>
            <NavLink to={route} className= {style}>{child}</NavLink>
        </>
    )
}

export default Links;