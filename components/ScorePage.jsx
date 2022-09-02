import React, { useState } from 'react'
import Link from 'next/link'

const ScorePage = ({ score }) => {
  return (
    <div className='h-screen bg-pink-500 flex justify-center lg:pt-72 md:pt-40 scorePageBackgroundImage pt-32'>
      <div>
        <div className='text-center'>
          <h1 className='text-white md:py-2 py-1 font-semibold lg:text-4xl text-3xl'>Your Score is</h1>
          <p className='text-red-300 md:py-2 py-1 font-semibold lg:text-5xl text-4xl'>{score}</p>
        </div>
        <div className='text-center'>
          {0 <= score && score < 2 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>What! You didn't even try</p>
            </div>
          }
          {2<= score && score < 5 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>Nice try. You can do better though</p>
            </div>
          }
          {5 <= score && score < 10 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>Decent. You're knowledge on flags is good</p>
            </div>
          }
          {10 <= score && score < 15 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>Wow. I'm impressed</p>
            </div>
          }
          {15 <= score && score < 20 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>You're Smart. Really Smart</p>
            </div>
          }
          {20 <= score && score < 30 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>Are you using Google. Because Wow. You're amazing</p>
            </div>
          }
        </div>
        <div className='flex justify-center'>
          <Link href='./'>
            <a><span className='transition duration-500 transform hover:scale-125 inline-block bg-pink-600 text-base md:text-lg font-medium rounded-full text-white px-8 md:px-12 py-2 cursor-pointer'>
              Retry
            </span></a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ScorePage