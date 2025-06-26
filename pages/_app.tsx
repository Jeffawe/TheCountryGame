import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Layout } from '../components'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

function MyApp({ Component, pageProps }: AppProps) {
  const [countries, setcountries] = useState<any[]>([]);
  const [isLoading, setisLoading] = useState(false);
  //sets the score of the player
  const [score, setscore] = useState(0);

  const router = useRouter();

  const setIsLoadingFalse = () => {
    setisLoading(false);
  }

  const addToScore = () => {
    setscore(score + 1);
  }

  const setScoreToZero = () => {
    setscore(0)
  }

  const onRegionClick = (region:String) => {
    setisLoading(false)
    const BaseUrl = 'https://restcountries.com/v3.1/region'
    let urlToUse = ` `
    switch(region) {
      case "europe":
        urlToUse =  `${BaseUrl}/europe`
        break;
      case "africa":
        urlToUse = `${BaseUrl}/africa`
        break;
      case "oceania":
        urlToUse = `${BaseUrl}/oceania`
        break;
      case "america":
        urlToUse = `${BaseUrl}/america`
        break;
      case "asia":
        urlToUse = `${BaseUrl}/asia`
        break;
      default:
        urlToUse = `${BaseUrl}/africa`
    }

    getCountries(urlToUse)
    gotoNextPage()
  }

  const gotoNextPage = () => {
    router.push('/question')
  }

  const getCountries = async (url:any) => {
    setisLoading(false);
    axios(url)
      .then((response) => {
        const countries = response.data;
        setcountries(countries)
        setisLoading(true);
      })
      .catch((error) => {
        console.log("Error Fetching Data");
        setisLoading(true);
      })
  }

  return (
    <Layout>
      <Component {...pageProps} getCountries={getCountries} onRegionClick={onRegionClick} countries={countries} 
        isLoading={isLoading} setLoadingFalse={setIsLoadingFalse} score={score} AddtoScore={addToScore} setscoreToZero={setScoreToZero}/>
    </Layout>
  )
}

export default MyApp
