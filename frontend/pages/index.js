import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import DropDownButton from '../components/DropDownButton'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [selectedToken, setSelectedToken] = useState('XLA'); 

  var c;

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

        <div className={styles.container}>
          <div className={styles.actiondiv}>
            <div className={styles.subContainer}>
              <p>You pay</p>
              <div className={styles.subsubContainer}>
                <input className={styles.input} type="number" placeholder="0"></input>
                <DropDownButton selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
              </div>
            </div>
            <div className={styles.subContainer}>
              <p>You receive</p>
              <div className={styles.subsubContainer}>
                <input className={styles.input} type="number" placeholder="0" value={c}></input>
                <button className={styles.outUnit}><b>{selectedToken === 'XLA' ? 'ETH' : 'XLA'}</b></button>
              </div>
            </div>

            <button className={styles.swap}>Swap</button>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <img className={styles.image} src="https://i.imgur.com/buNhbF7.png" />
        </div>
       
      </main>
    </>
  )
}
