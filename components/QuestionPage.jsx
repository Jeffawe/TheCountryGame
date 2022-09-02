import React, { useEffect, useState } from 'react'
import RandomFact from './RandomFact'
import { useRouter } from 'next/router'
import { BiShuffle } from 'react-icons/bi';


const QuestionPage = ({ country, isLoading, startButton, optionsArray, AddtoScore }) => {
  const router = useRouter();

  //Get the Country Flag for the particular Country
  const [countryFlag, setcountryFlag] = useState({})
  //Get the Country Name for the particular Country
  const [countryName, setcountryName] = useState({})
  //Get the Country Name for the particular Country
  const [countryParticularName, setcountryParticularName] = useState('')
  //button color for the first button
  const [color, setcolor] = useState('');
  //button color for the second button
  const [color2, setcolor2] = useState('');
  //button color for the thrid button
  const [color3, setcolor3] = useState('');
  //button color for the fourth button
  const [color4, setcolor4] = useState('');
  //Show a Random Fact
  const [randomFact, setrandomFact] = useState(false);
  //Start the Game
  const [startGame, setstartGame] = useState(false);
  //Check Active Button being Clicked
  const [activeButton, setActiveButton] = useState();
  //Holds the Right Answer
  const [rightAnswer, setrightAnswer] = useState(0);

  const checkIfCorrect = (option, id) => {
    setActiveButton(option);
    const blue = 'bg-blue-500';
    const red = 'bg-red-500';

    if (option == countryParticularName) {
      //Check the button that was pressed when the answer is right and make the button blue
      switch (id) {
        case 1:
          setcolor(blue);
          break;
        case 2:
          setcolor2(blue);
          break;
        case 3:
          setcolor3(blue);
          break;
        case 4:
          setcolor4(blue);
          break;
        default:
          setcolor(red)
      }

      //Open up the Random Fact Tab
      setrandomFact(true);
      AddtoScore();

    } else {
      //Check the button that was pressed when the answer is wrong and make the button red
      switch (id) {
        case 1:
          setcolor(red);
          break;
        case 2:
          setcolor2(red);
          break;
        case 3:
          setcolor3(red);
          break;
        case 4:
          setcolor4(red);
          break;
        default:
          setcolor(red);
      }
      showRealAnswer();

      setTimeout(() => {
        router.push('/scores')
      }, 3500);
    }
  }

  const showRealAnswer = () => {
    const blue = 'bg-blue-500';

    if (optionsArray[0] == countryParticularName) {
      setcolor(blue);
    } else if (optionsArray[1] == countryParticularName) {
      setcolor2(blue);
    } else if (optionsArray[2] == countryParticularName) {
      setcolor3(blue);
    } else if (optionsArray[3] == countryParticularName) {
      setcolor4(blue);
    }

  }

  //Starts the game once the startbutton is pressed
  const OnStartButtonPress = () => {
    if (isLoading) {
      setstartGame(true);
      startButton();
    }
  }

  //Refreshes the color and the buttons disabled back to its original state
  const Refresh = () => {
    setcolor('');
    setcolor2('');
    setcolor3('');
    setcolor4('');
    setActiveButton();
  }

  //Close the Random Fact tab
  const closeRandomFact = () => {
    setrandomFact(false);
  }

  //Shuffle the array of options
  const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  useEffect(() => {
    if (country) {
      shuffleArray(optionsArray);
      var obj = country.flags
      var objName = country.name
      if (obj) {
        var item = Object.values(obj)
        setcountryFlag(item)
      }
      if (objName) {
        //gets the values of the array 'name' sent by the API
        var itemName = Object.values(objName)
        setcountryName(itemName)
        //Gets the name of the country as a string
        const countryParticularName = itemName[0].toString();
        setcountryParticularName(countryParticularName)
        console.log(countryParticularName);
        //gets the index of the right answer
        const RightAnswer = optionsArray.indexOf(countryParticularName)
        setrightAnswer(RightAnswer);
      }

      Refresh()
    }
  }, [country])

  return (
    <div className='h-screen bg-pink-500 flex justify-center'>
      {!startGame &&
        <div className='self-center'>
          <span className='transition duration-500 transform hover:scale-125 inline-block bg-red-500 text-base md:text-2xl font-medium rounded-full text-white px-8 md:px-12 py-2 cursor-pointer' onClick={OnStartButtonPress}>
            Start
          </span>
        </div>
      }

      {startGame &&
        <div className='h-full flex flex-col md:flex-row justify-center '>
          <div className='w-full items-center flex justify-center md:pb-0 pb-5'>
            <div className='justify-center flex'>
              <img
                src={countryFlag[1]}
                alt={country.capital}
                className='w-3/4 flex justify-center'
              />
            </div>
          </div>
          <div className='w-full items-center flex justify-center'>
            <div className='px-5'>
              <div className='px-8 py-5'>
                <h1 className='text-center font-semibold text-white text-lg md:text-2xl'>What Country has this flag?</h1>
              </div>
              <div className='flex justify-center flex-col gap-y-5'>
                <button disabled={activeButton && activeButton !== optionsArray[0]} className={`transition duration-500 transform text-left hover:border-red-600 inline-block ${color} border-2 border-white text-sm md:text-lg font-medium rounded-full text-white px-8 md:px-12 py-2 cursor-pointer`} onClick={() => { checkIfCorrect(optionsArray[0], 1) }}>
                  {optionsArray[0]}
                </button>
                <button disabled={activeButton && activeButton !== optionsArray[1]} className={`transition duration-500 transform text-left hover:border-red-600 inline-block ${color2} border-2 border-white text-sm md:text-lg font-medium rounded-full text-white px-8 md:px-12 py-2 cursor-pointer`} onClick={() => { checkIfCorrect(optionsArray[1], 2) }}>
                  {optionsArray[1]}
                </button>
                <button disabled={activeButton && activeButton !== optionsArray[2]} className={`transition duration-500 transform text-left hover:border-red-600 inline-block ${color3} border-2 border-white text-sm md:text-lg font-medium rounded-full text-white px-8 md:px-12 py-2 cursor-pointer`} onClick={() => { checkIfCorrect(optionsArray[2], 3) }}>
                  {optionsArray[2]}
                </button>
                <button disabled={activeButton && activeButton !== optionsArray[3]} className={`transition duration-500 transform text-left hover:border-red-600 inline-block ${color4} border-2 border-white text-sm md:text-lg font-medium rounded-full text-white px-8 md:px-12 py-2 cursor-pointer`} onClick={() => { checkIfCorrect(optionsArray[3], 4) }}>
                  {optionsArray[3]}
                </button>
              </div>

              {/* Opens Up A random fact once the user gets the answer right */}
              {randomFact &&
                <div className='px-8 py-10'>
                  <RandomFact startButton={startButton} closeRandomFact={closeRandomFact} randomFactBool={randomFact} country={country} countryName={countryParticularName} />
                </div>
              }

            </div>
          </div>
        </div>
      }
    </div >
  )
}

export default QuestionPage