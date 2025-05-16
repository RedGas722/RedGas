import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './SearchBarr.css'

export const SearchBarr = () => {
    return (
        <div className='relative'>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-[10px] top-[9px] text-white" />
            <input type="text" id='Searchbarr' className='bg-transparent p-[10px_30px_10px_35px] w-[90%] h-[35px] border-[1.5px] border-white rounded-[100px] text-white' />
        </div>
    )
}

export default SearchBarr