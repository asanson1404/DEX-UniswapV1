import { VscArrowSwap } from "react-icons/vsc";
import styles from './style.module.css';

import {    XelaTokenAddress, XelaTokenABI,
            ExchangeAddress, ExchangeABI
} from "@/constants";   

import { useState } from 'react'
import { formatEther, parseEther } from 'viem'
import { useAccount, useBalance, useContractRead } from 'wagmi'
import { readContract, waitForTransaction, writeContract } from 'wagmi/actions'
import AddLiquidityComponent from "./AddLiquidity"

function Pool() {

    // BigInt bug: variable to have the right Unit
    const TO_ETH_UNIT = 10 ** 4;

    // State variable to show if liquidity is beeing added
    const [ isAdding, setIsAdding ] = useState(false);

    // Check if the users's wallet is connected or disconnected, store its address (Wagmi hooks) 
    const { address, isConnected } = useAccount();

    // Fetch the ETH Reserve
    const ethReserve = useBalance({
        address: ExchangeAddress,
        watch: true,
    });

    // Fetch the XLA Reserve
    const xelaReserve = useContractRead({
        address: ExchangeAddress,
        abi: ExchangeABI,
        functionName: 'getXelaReserve',
        watch: true,
    });

    // Fetch the number of LP tokens the user owns
    const userLpToken = useContractRead({
        address: ExchangeAddress,
        abi: ExchangeABI,
        functionName: 'balanceOf',
        args: [address],
        watch: true,
    });

    // Fetch the number of LP tokens emitted
    const totalLpToken = useContractRead({
        address: ExchangeAddress,
        abi: ExchangeABI,
        functionName: 'totalSupply',
        watch: true,
    });

    // Function which returns the user's share in the pool
    const userShare = () => {

        const formatTotalLp = formatEther(Number(totalLpToken.data));
        const formatUserLp  = formatEther(Number(userLpToken.data));

        if (formatTotalLp !== 0 ) {
            const userShare = (formatUserLp / formatTotalLp) * 100;
            return `${userShare} %`
        }
        else {
            return "Empty Pool"
        }
    };

    // Function which returns the xla price
    const xlaPrice = () => {
        return (formatEther(Number(ethReserve.data?.value)) / (formatEther(Number(xelaReserve.data)) / TO_ETH_UNIT))
    };

    // Function which returns the eth price
    const ethPrice = () => {
        return ((formatEther(Number(xelaReserve.data)) / TO_ETH_UNIT) / formatEther(Number(ethReserve.data?.value)))
    };

    return (
        <>
            <div>
                <p className={styles.poolsText}>POOLS</p>
                <div className={styles.container}>
                    <div className={styles.poolName}>ETH / XLA</div>
                    <div className={styles.poolsContainer}>
                        <div className={styles.pool}>
                            <p className={styles.poolToken}>ETH Pool</p>
                            <p className={styles.poolReserve}>
                                {ethReserve.data?.formatted} ETH
                            </p>
                            <p className={styles.price}>1ETH = {ethPrice()}XLA</p>
                        </div>
                        <VscArrowSwap className={styles.center} size={50} color="white"></VscArrowSwap>
                        <div className={styles.pool}>
                            <p className={styles.poolToken}>XLA Pool</p>
                            <p className={styles.poolReserve}>
                                {formatEther(Number(xelaReserve.data)) / TO_ETH_UNIT} XLA
                            </p>
                            <p className={styles.price}>1XLA = {xlaPrice()}ETH</p>
                        </div>
                    </div>
                    <AddLiquidityComponent />
                </div>
            </div>
            <p className={styles.share}>Your share in the pool: {userShare()}</p>
        </>
    )

}

export default Pool;