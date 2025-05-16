
export const Inputs = ({For, className, NameIn, Place}) => {
    return (
        <>
            <label htmlFor={For} className='text-white text-2xl w-full'>{NameIn}</label>
            <input type="text" placeholder={Place} id={For} style={className} className='border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-100 border-gray-300 outline-0' />
        </>
    )
}
