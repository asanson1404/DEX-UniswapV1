import { VscArrowSwap } from "react-icons/vsc";
import styles from './style.module.css';

import { ExchangeAddress, ExchangeABI } from "@/constants";   

import { formatEther } from 'viem'
import { useAccount, useBalance, useContractRead } from 'wagmi'
import AddLiquidityComponent from "./AddLiquidity"
import RemoveLiquidityComponent from "./RemoveLiquidity"

export default function Pool() {

    // Store the address of the connected user 
    const { address } = useAccount();

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

        if (totalLpToken.data && userLpToken.data) {
            const formatTotalLp = formatEther(totalLpToken.data);
            const formatUserLp  = formatEther(userLpToken.data);
    
            if (formatTotalLp !== 0 ) {
                const userShare = roundNumber((formatUserLp / formatTotalLp) * 100);
                return `${userShare} %`
            }
            else {
                return "Empty Pool"
            }
        }
        else {
            return "0 %"
        }
    };

    // Function which returns the xla price
    const xlaPrice = () => {
        if (ethReserve.data && xelaReserve.data) {
            return (formatEther(ethReserve.data.value) / formatEther(xelaReserve.data))
        }
    };

    // Function which returns the eth price
    const ethPrice = () => {
        if (xelaReserve.data && ethReserve.data) {
            return (formatEther(xelaReserve.data) / formatEther(ethReserve.data.value))
        }
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
                                {ethReserve.data && (ethReserve.data.formatted)} ETH
                            </p>
                            <p className={styles.price}>1ETH = {roundNumber(ethPrice())}XLA</p>
                        </div>
                        <VscArrowSwap className={styles.center} size={50} color="white"></VscArrowSwap>
                        <div className={styles.pool}>
                            <p className={styles.poolToken}>XLA Pool</p>
                            <p className={styles.poolReserve}>
                                {xelaReserve.data && (formatEther(xelaReserve.data))} XLA
                            </p>
                            <p className={styles.price}>1XLA = {roundNumber(xlaPrice())}ETH</p>
                        </div>
                    </div>
                    <div className={styles.liquidityButtons}>
                        <AddLiquidityComponent />
                        <RemoveLiquidityComponent />
                    </div>
                </div>
            </div>
            <p className={styles.share}>Your share in the pool: {userShare()}</p>
        </>
    )

}

// Function to round a number according to its value
export function roundNumber(number) {
    if (number) {
        const splitNumberArray = number.toString().split('.');
        if (splitNumberArray.length === 1) {
            return number;
        } else {
            const nbDecimals = splitNumberArray[1].length;
            if (nbDecimals >= 6) return number.toFixed(6);
            for (let i = 5; i > 0; i--) {
                if (nbDecimals === i) return number.toFixed(i);
            }
        }
    }
}