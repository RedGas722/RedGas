import React from 'react'
import LinksNav from '../../Links/LinksNav';
import reactimg from '/src/assets/react.svg'
import './ProfilePhoto.css'

export const ProfilePhoto = () => {
    return (
        <div id='photo' >
            <LinksNav route=""  child={<img src={reactimg} alt="React Logo" className='w-[50px]' />} />
        </div>
    )
}

export default ProfilePhoto;