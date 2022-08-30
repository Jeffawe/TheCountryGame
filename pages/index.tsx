import type { NextPage } from 'next'
import Head from 'next/head'
import { Navbar, HomePage } from '../components'
import Image from 'next/image'
import { useEffect } from 'react'

const Home: NextPage = ({ onRegionClick, setscoreToZero }: any) => {
  useEffect(() => {
    setscoreToZero()
  }, [])

  return (
    <div className="scroll-smooth">
      <Head>
        <title>The Country Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HomePage onRegionClick={onRegionClick} />
      </main>

    </div>
  )
}

export default Home
