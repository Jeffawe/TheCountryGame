import React, { useState } from 'react'
import Link from 'next/link'

const ScorePage = ({ score }) => {
  return (
    <div className='h-screen bg-pink-500 flex justify-center lg:pt-72 md:pt-40 scorePageBackgroundImage pt-40'>
      <div>
        <div className='text-center'>
          <h1 className='text-white md:py-2 py-1 font-semibold lg:text-4xl text-3xl'>Your Score is</h1>
          <p className='text-red-300 md:py-2 py-1 font-semibold lg:text-5xl text-4xl'>{score}</p>
        </div>
        <div className='text-center'>
          {0 <= score && score < 2 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>Don't give up. Give it another go.</p>
            </div>
          }
          {2<= score && score < 5 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>Nice try. Give it another go. I'm sure you can do better</p>
            </div>
          }
          {5 <= score && score < 10 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>You're getting better. The Sky is your limit now</p>
            </div>
          }
          {10 <= score && score < 15 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>Wow. Amazing. I'm Impressed</p>
            </div>
          }
          {15 <= score && score < 20 &&
            <div>
              <p className='text-white py-5 font-semibold text-base'>You're Smart. Really Smart</p>
            </div>
          }
          {20 <= score  &&
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