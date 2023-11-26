import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Swapper from '@/components/swapper/Swapper'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <>
      <Head>
        <title>Xela Exchange</title>
        <meta name="description" content="Exchange to swap XELA <> ETH" />
        <link rel="icon" href="/sd-logo-det.ico" />
      </Head>

      <div className={`${styles.header} ${inter.className}`}>
        <div className={styles.pages}>
          <Link href="/" className={styles.link}>
            <p>Swap</p>  
          </Link>
          <Link href="/pool" className={styles.link}>
            <p>Pool</p>  
          </Link>
          <Link href="/mint" className={styles.link}>
            <p>Mint</p>  
          </Link>
        </div>
        <ConnectButton showBalance={false}/>
      </div>

      <main className={`${styles.main} ${inter.className}`}>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/Xela_Exchange.svg"
            alt="Next.js Logo"
            width={580}
            height={270}
            priority
          />
        </div>

        <Swapper/>

        <div className={styles.imageContainer}>
          <img className={styles.image} src="https://i.imgur.com/buNhbF7.png" />
        </div>
       
      </main>
    </>
  )
}
