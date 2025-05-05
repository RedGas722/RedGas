
export const Text = ({Have, GoTo}) => {
    return (
        <div className='flex gap-[5px]'>
            <p className='text-[13px] text-gray-300'>{Have}</p>
            <p className='text-[13px] text-white font-bold'>{GoTo}</p>
        </div>
    )
}
export default Text;