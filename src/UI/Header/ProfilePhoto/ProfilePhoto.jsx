import React from 'react'
import LinksNav from '../../Links/LinksNav';
// import reactimg from '/src/assets/react.svg'
import './ProfilePhoto.css'

export const ProfilePhoto = () => {
    return (
        <div id='photo' >
            <LinksNav route="/Register"  child={<img src='https://preview.redd.it/0mdq2qu0da591.jpg?width=640&crop=smart&auto=webp&s=b1a1e5bbac40f0c40e8391a62224ff74cdb25009' alt="React Logo" className='w-[60px] rounded-full' />} />
        </div>
    )
}

export default ProfilePhoto;