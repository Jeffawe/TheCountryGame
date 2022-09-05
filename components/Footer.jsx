import React from 'react'

const Footer = () => {
  return (
    <div className='flex flex-col bg-red-500 p-3'>
        <div className='flex flex-col md:flex-row w-full'>
            <div className='md:flex md:flex-row w-full px-5 py-5 md:py-3'>
                <p className='text-white text-sm md:text-base md:text-left text-center font-normal cursor-pointer'>Designed by Jeffery Ozoekwe-Awagu</p>
            </div>
            <div className='px-4 py-0 md:py-3 md:flex md:flex-row-reverse w-full'>
                <p className='text-white text-sm md:text-base md:text-left text-center font-normal cursor-pointer'>Background Image by <a href='https://www.istockphoto.com/portfolio/Anastasiia_Guseva?mediatype=photography'>Anastasiia_Guseva</a></p>
            </div>
        </div>
        <div className='flex justify-center p-2'>
            <p className='text-white text-sm md:text-base font-normal cursor-pointer'>Powered by <a href='https://restcountries.com/'>Rest Countries </a></p>
        </div>
        <div className='flex justify-center pb-5'>
            <p className='text-white text-sm md:text-base font-normal cursor-pointer'>Globe Icon by Icon8</p>
        </div>
    </div>
  )
}

export default Footer