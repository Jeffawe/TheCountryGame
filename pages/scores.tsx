import type { NextPage } from 'next'
import Head from 'next/head'
import { ScorePage } from '../components'
import { useEffect, useState } from 'react'

const scores: NextPage = ({ score }: any) => {

    return (
        <div className='scroll-smooth'>
            <Head>
                <title>The Country Game</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <ScorePage score={score}/>
            </main>
        </div>
    )

}

export default scores