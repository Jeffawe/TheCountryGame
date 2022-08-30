import type { NextPage } from 'next'
import Head from 'next/head'
import { QuestionPage, ErrorPage, ExhaustedCountryList } from '../components'
import { useEffect, useState } from 'react'

const question: NextPage = ({ countries, isLoading, setLoadingFalse, AddtoScore }: any) => {
  //Holds the random variable used to get a random country from the Array of countries
  const [randomNumber, setrandomNumber] = useState(0);
  //Holds the random variables used to get the random countries. Ensures that one country does not show more than once
  const [randomNumberArray, setrandomNumberArray] = useState<Number[]>([]);
  //Holds the different options available for the user to pick. One is the right answer
  const [OptionsArray, setOptionsArray] = useState<String[]>([])
  //Stores the random values generated for the different options to ensure that one option is not shown more than once
  const [randomOptionArray, setrandomOption] = useState<Number[]>([])
  //Holds the particular random country details to be shown to the user
  const [country, setcountry] = useState([])
  //Used to check if the list of countries has all been answered by the user
  const [ExhaustedList, setExhaustedList] = useState(false)

  const getRandomNumber = () => {
    //Empties both Arrays of whatever they hold
    //Checks if there is data coming from the API
    if (isLoading) {
      setOptionsArray([]);
      setrandomOption([]);
      //Gets a random variable below the length of the countries array
      var randomItem = Math.floor(Math.random() * countries.length);
      //Checks if the random number is in the randomNumberArray Array. Returns true if it is
      const CheckNumber = randomNumberArray.includes(randomItem);
      if (randomItem !== randomNumber && !CheckNumber) {
        setrandomNumber(randomItem)
        setrandomNumberArray((current) => [...current, randomItem])
        var country = countries[randomItem];
        setcountry(country);
        var objName = country.name
        if (objName) {
          var itemName: any = Object.values(objName)
          var value = itemName[0].toString()
          const CheckIfThere = OptionsArray.includes(value);
          console.log(CheckIfThere);

          if (!CheckIfThere) {
            setOptionsArray(current => [...current, value])
          }
        }
        console.log(country);
        getOptions(randomItem)
        getOptions(randomItem)
        getOptions(randomItem)
        console.log(OptionsArray)
        console.log(randomOptionArray)
      } else {
        getRandomNumber()
      }
    }
  }

  const getOptions = (randomItem: any) => {
    if (isLoading) {
      let randomOption = Math.floor(Math.random() * countries.length);
      let CheckOptions = false
      while (randomOptionArray.some(e => e === randomOption)) {
        randomOption = Math.floor(Math.random() * countries.length);
      }
      console.log(CheckOptions)
      if (randomOption !== randomItem) {
        setrandomOption((current) => [...current, randomOption])
        var optionCountry = countries[randomOption];
        var objName2 = optionCountry.name

        if (objName2) {
          var itemName2: any = Object.values(objName2)
          var value2 = itemName2[0]
          setOptionsArray((current) => [...current, value2])
        } else {
          getOptions(randomItem)
        }
      } else {
        getOptions(randomItem)
      }
    }
  }

  const newCountry = () => {
    if (randomNumberArray.length !== countries.length) {
      getRandomNumber();
    } else {
      setExhaustedList(true);
    }
  }

  useEffect(() => {
    console.log(countries)
    if (countries) {

    }
  }, [countries])


  return (
    <div className="scroll-smooth">
      <Head>
        <title>The Country Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {countries.length > 0 && !ExhaustedList &&
        <main>
          <QuestionPage country={country} isLoading={isLoading} optionsArray={OptionsArray} startButton={newCountry} AddtoScore={AddtoScore} />
        </main>
      }

      {(countries == undefined || null) || countries.length == 0 &&
        <main>
          <ErrorPage isLoading={isLoading} />
        </main>
      }

      {ExhaustedList &&
        <main>
          <ExhaustedCountryList />
        </main>
      }

    </div>
  )
}

export default question