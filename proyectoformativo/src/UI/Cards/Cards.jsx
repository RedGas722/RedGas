import React from 'react'

export const Cards = () => {
    return (
        <div className="h-svh flex items-center justify-center">
            <div className="relative h-fit w-fit">
                <div className="clip-path-triangle w-[300px] h-[380px] bg-blue-500 rounded-[20px]"></div>
                <div className="clip-path-triangle-inverse rounded-t-[20px] rounded-br-[20px] w-[150px] h-[150px] bg-amber-600 absolute right-0 bottom-0"></div>

            </div>
        </div>
    )
}

export default Cards;