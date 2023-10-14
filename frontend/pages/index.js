import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Xela Exchange</title>
        <meta name="description" content="Exchange to swap XELA <> ETH" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.connectButton}>
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
          <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                Learn <span>-&gt;</span>
              </h2>
              <p>
                Learn about Next.js in an interactive course with&nbsp;quizzes!
              </p>
          </a>
        </div>

        <div className={styles.containera}>
          <image src="/vercel.svg"></image>
          <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                Learn <span>-&gt;</span>
              </h2>
              <p>
                Learn about Next.js in an interactive course with&nbsp;quizzes!
              </p>
          </a>
        </div>


       
      </main>
    </>
  )
}
