import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './SearchBarr.css'

export const SearchBarr = () => {
    return (
        <div className='inputs relative NeoSubContainer_inset_TOTAL'>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-[10px] top-[9px] text-[var(--Font-Nav)]" />
            <input type="text" id='Searchbarr' className='bg-transparent outline-0 p-[10px_10px_10px_35px] w-[100%] h-[35px] rounded-[100px] text-[var(--main-color)]' />
        </div>
    )
}

export default SearchBarr