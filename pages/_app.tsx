import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Montserrat } from 'next/font/google'
import { Layout } from '../components'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' })

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={montserrat.className}>
      <Head>
        <title>The Country Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content="Test your geography. Identify the country behind each flag from around the world." />
        <meta name="theme-color" content="#020617" />
        <meta property="og:title" content="The Country Game" />
        <meta property="og:description" content="How good is your geography? Name the country behind each flag." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://flagcdn.com" crossOrigin="" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}
