import Link from 'next/link';
import React from 'react'
import { FcGlobe } from "react-icons/fc";

const Navbar = () => {
  return (
    <div className='flex justify-center bg-red-500 p-3 relative'>
        <div>
            <Link href='./'><FcGlobe size={50} className='hover:animate-spin' /></Link>
        </div>
    </div>
  )
}

export default Navbar