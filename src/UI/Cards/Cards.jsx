import './Cards.css'

export const Cards = () => {
    return (
        <section id='CardSect' className="h-fit flex items-center justify-center w-[100%]">
            <div className='cards_shadow bg-glass-1'>
                <div className="clip-path-triangle w-[300px] h-[380px] bg-glass rounded-[20px]"></div>
                <div className="clip-path-triangle-inverse rounded-t-[20px] rounded-br-[20px] w-[150px] h-[160px] bg-glass absolute right-0 bottom-0"></div>
            </div>
        </section>
    )
}

export default Cards;