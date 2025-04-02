import './Cards.css'

export const Cards = () => {
    return (
        <div className="h-fit w-fit flex items-center justify-center">
            <div className='cards_shadow '>
                <div className="clip-path-triangle bg-glass-1 w-[300px] h-[380px] bg-glass rounded-[20px]"></div>
                <div className="clip-path-triangle-inverse bg-glass-1 rounded-t-[20px] rounded-br-[20px] w-[150px] h-[160px] bg-glass absolute right-0 bottom-0"></div>
            </div>
        </div>
    )
}

export default Cards;