import type { NextPage } from 'next'
import Head from 'next/head'
import { QuestionPage, ErrorPage, ExhaustedCountryList } from '../components'
import { useEffect, useState } from 'react'

const question: NextPage = ({ countries, isLoading, setLoadingFalse, AddtoScore }: any) => {
  //Holds the random variables used to get the random countries. Ensures that one country does not show more than once
  const [randomNumberArray, setrandomNumberArray] = useState<Number[]>([]);
  //Holds the different options available for the user to pick. One is the right answer
  const [OptionsArray, setOptionsArray] = useState<String[]>([])
  //Holds the particular random country details to be shown to the user
  const [country, setcountry] = useState([])
  //Used to check if the list of countries has all been answered by the user
  const [ExhaustedList, setExhaustedList] = useState(false)


  const getRandomNumbers = () => {
    const set = new Set()

    while (set.size < 4) {
      set.add(Math.floor(Math.random() * countries.length));
    }

    var numbers = Array.from(set);
    return numbers;
  }

  const getRandomNumber = () => {
    if (isLoading) {
      //Cleares the Options
      setOptionsArray([]);
      //Creates a new array
      let Options = [];
      Options = getRandomNumbers();
      console.log(Options);

      //Picks a random index number in the Options Array
      const randomNumber = Math.floor(Math.random() * Options.length);
      //Gets the Number in Options
      let randomItem: any = Options[randomNumber]
      setrandomNumberArray(current => [...current, randomItem]);

      var country = countries[randomItem];
      setcountry(country);
      getOptions(Options);
      console.log(OptionsArray);
    }
  }


  const getOptions = (Options: any) => {
    const arr = [];
    for (let i = 0; i < Options.length; i++) {
      var optionNumber = Options[i]
      var optionCountry = countries[optionNumber];
      var objName = optionCountry.name

      if (objName) {
        var itemName: any = Object.values(objName)
        var value = itemName[0]
        console.log(Options[i]);
        console.log(value);
        arr.push(value);
        console.log(arr);
      }
    }
    setOptionsArray(arr);
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
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;400;600;700&display=swap" rel="stylesheet"></link>
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