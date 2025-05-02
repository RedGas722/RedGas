// filepath: c:\Users\asusi\OneDrive\Escritorio\RedGas\src\UI\Header\ProfilePhoto\ProfilePhoto.jsx
import React from 'react';
import LinksNav from '../../Links/LinksNav';
import './ProfilePhoto.css';

export const ProfilePhoto = ({ imageUrl, altText }) => {
    return (
        <div id='photo'>
            <LinksNav route="" child={<img src={imageUrl} alt={altText} className='w-[60px] rounded-full' />} />
        </div>
    );
};

export default ProfilePhoto;