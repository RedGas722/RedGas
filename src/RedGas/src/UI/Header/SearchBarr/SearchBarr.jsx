// filepath: c:\Users\asusi\OneDrive\Escritorio\RedGas\src\UI\Header\SearchBarr\SearchBarr.jsx
import React from 'react';
import './SearchBarr.css';

export const SearchBarr = () => {
    return (
        <div className="search-bar-container">
            <input 
                type="text" 
                id='Searchbarr' 
                className='bg-transparent w-[90%] h-[35px] border-[1.5px] border-white rounded-[100px] text-white' 
                placeholder="Search..."
            />
        </div>
    );
}

export default SearchBarr;