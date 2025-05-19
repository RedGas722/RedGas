import './TechniciansPage.css'
import usuarios from "./TechniciansArray"

export const TechniciansPage = () => {
    return (
        <section className="h-fit p-[20px_0] flex flex-wrap justify-center justify-self-center self-center items-center gap-[20px]">
            {usuarios.map((usuario, index) => (
                <div key={index} className="flex flex-col items-center text-center gap-[20px] w-[300px] h-[500px] NeoContainer_outset_TL">
                    <div className='flex flex-col items-center justify-center gap-2.5 p-[10px_0]'>
                        <h3 className="text-[var(--main-color-sub)]">Técnico</h3>
                        <img src={usuario.foto} alt={usuario.nombre} className="h-[200px] rounded-[20px]" />
                    </div>
                    <div className="Info relative h-full p-[10px_5px_10px_0] flex flex-col items-center justify-start font-bold gap-[20px]">
                        <div className="flex gap-[3px] text-[var(--Font-Nav)] text-[18px]">
                            <p className="Points">{usuario.calificacion}</p>
                            <p className="text-black">/</p>
                            <p className="Points">5</p>
                        </div>
                        <h2 className="text-2xl text-[var(--main-color)] max-w-[250px]">{usuario.nombre}</h2>
                        <button className="BTN NeoSubContainer_outset_TL absolute bottom-2.5 min-w-[150px] flex flex-col justify-self-end w-full cursor-pointer">Contactar</button>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default TechniciansPage
