import React from "react";
import { Inter } from 'next/font/google'
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from '../styles/Pool.module.css'
import DynamicPool from "@/components/pool/DynamicPool";

const inter = Inter({ subsets: ['latin'] })

export default function PoolPage() {

    return(

        <>

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

            <div className={`${styles.main} ${inter.className}`}>

                <div className={styles.textContainer}>
                    <h2>Become a Market Maker by providing liquidity</h2>
                    <h3>&</h3>
                    <h3>Earn yield based on your share in the Pool</h3>
                </div>

                <DynamicPool/>

            </div>

            <div className={styles.imageContainer}>
            <img className={styles.image} src="https://i.imgur.com/buNhbF7.png" />
            </div>

        </>

    )
}