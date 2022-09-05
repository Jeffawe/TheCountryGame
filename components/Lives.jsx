import React, { useEffect, useState } from 'react'
import { AiFillHeart } from "react-icons/ai";
import AnimateOnChange from 'react-animate-on-change'

const Lives = ({livesLeft, livesReducing}) => {
    useEffect(() => {
        console.log(livesLeft)
    }, [])

    const color = 'rgb(255,3,62)';

    return (
        <div className='flex flex-col'>
            <div className='flex justify-center flex-row'>
                <div className='flex'>
                    {livesReducing && livesLeft == 0 &&
                        <AiFillHeart color={`${color}`} className='md:text-7xl text-5xl puff-out-center absolute' />
                    }
                    {livesLeft >= 1 &&
                        <AiFillHeart color={`${color}`} className='md:text-7xl text-5xl relative' />
                    }
                </div>
                <div className='flex'>
                    {livesReducing && livesLeft == 1 &&
                        <AiFillHeart color={`${color}`} className='md:text-7xl text-5xl puff-out-center absolute' />
                    }
                    {livesLeft >= 2 &&
                        <AiFillHeart color={`${color}`} className='md:text-7xl text-5xl relative' />
                    }
                </div>
                <div className='flex'>
                    {livesReducing &&
                        <AiFillHeart color={`${color}`} className='md:text-7xl text-5xl puff-out-center absolute' />
                    }
                    {livesLeft == 3 &&
                        <AiFillHeart color={`${color}`} className='md:text-7xl text-5xl relative' />
                    }
                </div>
            </div>
            <div className='flex justify-center pt-3'>
                <h1 className='text-white font-normal text-base md:text-lg'>{(livesLeft + 1) !== 1 ? `You have ${livesLeft + 1} Chances Remaining` : `You have ${livesLeft + 1} Chance Remaining`}</h1>
            </div>
        </div>
    )
}

export default Lives;