import React, { useState } from 'react'
import Link from 'next/link';

const HomePage = ({onRegionClick}) => {
    const [showDropDown, setshowDropDown] = useState(false)
    const [showRegionDropDown, setshowRegionDropDown] = useState(false)

    const RegionDropDownControl = () => {
        if(showRegionDropDown == true){
            setshowRegionDropDown(false)
        }else if(showRegionDropDown == false){
            setshowRegionDropDown(true)
        }
    }

    const onPickRegion = (name) => {
        setshowRegionDropDown(false)
        onRegionClick(name)
    }
    

    return (
        <div className='flex justify-center h-screen backgroundImage'>
            <div className='md:p-10 p-3 pt-40 md:py-0 md:self-center'>
                <div className=''>
                    <h1 className='text-center text-4xl md:text-5xl lg:text-8xl text-white font-bold p-5'>The Country Game</h1>
                    <p className='text-center text-base md:text-xl text-white font-normal'>How good are you in Geography? Let's Find out.</p>
                </div>
                <div className='flex justify-center py-8'>
                    <a>
                        <span className='transition duration-500 transform hover:scale-125 inline-block bg-pink-600 text-base md:text-lg font-medium rounded-full text-white px-8 md:px-12 py-2 cursor-pointer' onClick={() => { setshowDropDown(true) }}>
                            Start
                        </span>
                    </a>
                </div>
                {showDropDown &&
                    <div className='flex justify-center'>
                        <div className="relative inline-block text-left">
                            <div>
                                <button type="button" className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-5 py-3 bg-white text-sm md:text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                    id="menu-button"
                                    aria-expanded="true"
                                    aria-haspopup="true"
                                    onClick={RegionDropDownControl}
                                >
                                    Select a Region
                                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {/* <!--
                        Dropdown menu, show/hide based on menu state.

                        Entering: "transition ease-out duration-100"
                        From: "transform opacity-0 scale-95"
                        To: "transform opacity-100 scale-100"
                        Leaving: "transition ease-in duration-75"
                        From: "transform opacity-100 scale-100"
                        To: "transform opacity-0 scale-95"
  --> */}
                            {showRegionDropDown &&
                                <div className="origin-top-right absolute right-0 mt-2 w-32 md:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                                    <div className="py-1" role="none">
                                        <a className="text-gray-700 hover:bg-blue-300 block px-4 py-2 text-sm cursor-pointer" role="menuitem" tabIndex="-1" id="menu-item-1" onClick={() => {onPickRegion('europe')}}>Europe</a>
                                        <a className="text-gray-700 hover:bg-blue-300 block px-4 py-2 text-sm cursor-pointer" role="menuitem" tabIndex="-1" id="menu-item-2" onClick={() => {onPickRegion('africa')}}>Africa</a>
                                        <a className="text-gray-700 block hover:bg-blue-300 px-4 py-2 text-sm cursor-pointer" role="menuitem" tabIndex="-1" id="menu-item-2" onClick={() => {onPickRegion('america')}}>The Americas</a>
                                        <a className="text-gray-700 block hover:bg-blue-300 px-4 py-2 text-sm cursor-pointer" role="menuitem" tabIndex="-1" id="menu-item-2" onClick={() => {onPickRegion('asia')}}>Asia</a>
                                        <a className="text-gray-700 block hover:bg-blue-300 px-4 py-2 text-sm cursor-pointer" role="menuitem" tabIndex="-1" id="menu-item-2" onClick={() => {onPickRegion('oceania')}}>Australia</a>
                                    </div>
                                </div>
                            }
                            {!showRegionDropDown &&
                                <div></div>
                            }
                        </div>
                    </div>
                }

                {!showDropDown &&
                    <div></div>
                }
            </div>
        </div>
    )
}

export default HomePage