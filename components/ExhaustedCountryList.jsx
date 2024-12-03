import React from 'react'

const ExhaustedCountryList = () => {
  return (
    <div className='h-screen bg-pink-500 flex justify-center lg:pt-72 md:pt-40 scorePageBackgroundImage pt-32'>
      <div>
        <div className='text-center'>
          <h1 className='text-white md:py-2 py-1 font-semibold lg:text-4xl text-3xl'>Your Score is</h1>
          <p className='text-red-300 md:py-2 py-1 font-semibold lg:text-5xl text-4xl'>{score}</p>
        </div>
        <div className='text-center'>
            <div>
              <p className='text-white py-5 font-semibold text-base'>Amazing. You got the flags for an entire continent. Try another continent and continue to show how good you are</p>
            </div>
        </div>
        <div className='flex justify-center'>
          <Link href='./'>
            <span className='transition duration-500 transform hover:scale-125 inline-block bg-pink-600 text-base md:text-lg font-medium rounded-full text-white px-8 md:px-12 py-2 cursor-pointer'>
              Retry
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ExhaustedCountryList