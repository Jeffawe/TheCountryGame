import React from 'react'
import { BiError } from "react-icons/bi";

const ErrorPage = ({ isLoading }) => {
  return (
    <div className='h-screen bg-pink-500 flex justify-center items-center'>
      {isLoading &&
        <div >
          <div className='flex justify-center'>
            <BiError size={100} color='red' />
          </div>
          <div className='md:px-2 px-8'>
            <h1 className='text-center text-white text-xl md:text-2xl font-bold'>Page not Found</h1>
            <ul className='text-center py-1 text-white text-base md:text-lg pt-5 font-semibold'>This probably happened because:</ul>
            <li className='md:py-0 py-1 text-white  text-base md:text-lg font-semibold'>Poor Network Connection</li>
            <li className='text-white  text-base md:text-lg font-semibold'>The Keyword you requested is not currently available. Try another keyword</li>
          </div>
        </div>
      }
      {
        !isLoading &&
        <div className='flex flex-row gap-x-3'>
          <div className='rounded-full bg-blue-500 animate-pulse p-3 md:p-5'></div>
          <div className='rounded-full bg-red-500 animate-pulse p-3 md:p-5'></div>
          <div className='rounded-full bg-green-500 animate-pulse p-3 md:p-5'></div>
          <div className='rounded-full bg-yellow-500 animate-pulse p-3 md:p-5'></div>
        </div>
      }

    </div >
  )
}

export default ErrorPage