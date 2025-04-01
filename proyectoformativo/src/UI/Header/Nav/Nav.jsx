import LinksNav  from '../../Links/LinksNav'

export const Navs = () => {
    return (
        <div className="flex gap-2.5">
            <LinksNav route="" child="Inicio" className="text-blue-500" />
            <LinksNav route="" child="Ofertas" className="text-blue-500" />
            <LinksNav route="" child="Productos" className="text-blue-500" /> 
            <LinksNav route="" child="Tecnicos" className="text-blue-500" /> 
        </div>
    )
}

export default Navs;