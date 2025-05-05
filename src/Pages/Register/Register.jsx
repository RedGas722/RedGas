import React from 'react'

export const Register = () => {
    return (
        <div>
            <h1 className='text-center text-4xl font-bold'>Register</h1>
            <form className='flex flex-col gap-4 w-[400px] mx-auto mt-10'>
                <input type="text" placeholder='Username' className='border-2 border-gray-300 p-2 rounded-md' />
                <input type="email" placeholder='Email' className='border-2 border-gray-300 p-2 rounded-md' />
                <input type="password" placeholder='Password' className='border-2 border-gray-300 p-2 rounded-md' />
                <button type="submit" className='bg-blue-500 text-white p-2 rounded-md'>Register</button>
            </form>
        </div>
    )
}
export default Register