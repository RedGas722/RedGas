export const LinksNav = ({route, child, className}) => {
    return (
        <div>
            <a href={route} className={className}>{child}</a>
        </div>
    )
}

export default LinksNav;