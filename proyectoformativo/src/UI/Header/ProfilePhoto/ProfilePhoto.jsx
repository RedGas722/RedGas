import React from 'react'
import LinksNav from '../../Links/LinksNav';
import reactimg from '/src/assets/react.svg'
import './ProfilePhoto.css'

export const ProfilePhoto = () => {
    return (
        <div >
            <LinksNav route="" child={<img src={reactimg} alt="React Logo" />} />
        </div>
    )
}

export default ProfilePhoto;