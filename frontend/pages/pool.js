import React from "react";
import { Inter } from 'next/font/google'
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from '../styles/Pool.module.css'
import { VscArrowSwap } from "react-icons/vsc";

const inter = Inter({ subsets: ['latin'] })

export default function Pool() {
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

            <div>
                <p className={styles.poolsText}>POOLS</p>
                <div className={styles.container}>
                    <div className={styles.poolName}>ETH / XLA</div>
                    <div className={styles.poolsContainer}>
                        <div className={styles.pool}>
                            <p className={styles.poolToken}>ETH Pool</p>
                            <p className={styles.poolReserve}>Reserve: </p>
                            <p className={styles.price}>1ETH = XLA</p>
                        </div>
                        <VscArrowSwap className={styles.center} size={50} color="white"></VscArrowSwap>
                        <div className={styles.pool}>
                            <p className={styles.poolToken}>XLA Pool</p>
                            <p className={styles.poolReserve}>Reserve: </p>
                            <p className={styles.price}>1XLA = ETH</p>
                        </div>
                    </div>
                    <div className={styles.addLiquidityButton}>
                        <button className={styles.addLiquidityButton}>+ Add Liquidity</button>
                    </div>
                </div>
            </div>
            <p className={styles.share}>Your share in the pool: 0%</p>

        </div>

        <div className={styles.imageContainer}>
          <img className={styles.image} src="https://i.imgur.com/buNhbF7.png" />
        </div>

        </>

    )
}