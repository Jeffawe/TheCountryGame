import React, { useEffect, useState } from 'react'

const RandomFact = ({ startButton, closeRandomFact, randomFactBool, country, countryName }) => {
    //Holds Numbers that will be randomly picked to show a random fact
    const [randomFactNumber, setrandomFactNumber] = useState(0);
    //hold the country language
    const [countryLangauge, setcountryLanguage] = useState([])
    //Holds the Currency of the Country
    const [countryCurrency, setcountryCurrency] = useState([])

    const Next = () => {
        startButton();
        closeRandomFact();
    }

    useEffect(() => {
        var objName = country.languages
        var objCurrency = country.currencies
        if (randomFactBool == true) {
            //Gets a random Number between the length of randomFactNumber
            var randomOption = Math.floor(Math.random() * 5);
            setrandomFactNumber(randomOption);

            if (objName) {
                //gets the values of the array 'languages' sent by the API
                var itemName = Object.values(objName)
                setcountryLanguage(itemName)
            }

            if(objCurrency){
                var itemCurrency = Object.values(objCurrency)
                var itemParticularCurrency = Object.values(itemCurrency[0])
                setcountryCurrency(itemParticularCurrency);
            }
        }
    }, [randomFactBool])


    return (
        <div className='flex flex-col items-center md:pb-0 pb-20' id='randomFact'>
            <div className='p-3'>
                <div className='py-2'>
                    <h1 className='text-white md:text-lg text-base font-semibold text-center'>Random Fact</h1>
                </div>
                {randomFactNumber == 0 &&
                    <div>
                        <h1 className='text-white md:text-lg text-base text-center font-normal'>The Capital of {countryName} is {country.capital}.</h1>
                    </div>
                }
                {randomFactNumber == 1 &&
                    <div>
                        <h1 className='text-white md:text-lg text-base text-center font-normal'>The Population of {countryName} is {(country.population).toLocaleString(undefined, { maximumFractionDigits: 2 })}.</h1>
                    </div>
                }
                {randomFactNumber == 2 &&
                    <div>
                        <h1 className='text-white md:text-lg text-base text-center font-normal'>The Official language of {countryName} is {countryLangauge[0]}.</h1>
                    </div>
                }
                {randomFactNumber == 3 &&
                    <div>
                        <h1 className='text-white md:text-lg text-base text-center font-normal'>The Currency used in {countryName} is {countryCurrency[0]} ({countryCurrency[1]}).</h1>
                    </div>
                }
                {randomFactNumber == 4 &&
                    <div>
                        <h1 className='text-white md:text-lg text-base text-center font-normal'>The Area code of {countryName} is {country.area}.</h1>
                    </div>
                }
            </div>
            <span className='w-32 transition duration-500 transform hover:-translate-y-1 inline-block bg-blue-500 text-base md:text-lg font-normal text-center rounded-full text-white px-8 md:px-12 py-2 cursor-pointer' onClick={Next}>
                Next
            </span>
        </div>
    )
}

export default RandomFact