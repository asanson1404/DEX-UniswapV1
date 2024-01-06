import styles from './style.module.css';
import Popup from 'reactjs-popup';
import { useEffect, useState } from 'react';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import { prepareWriteContract, writeContract, waitForTransaction } from 'wagmi/actions';
import { formatEther, parseEther } from 'viem'
import { roundNumber } from './Pool';
import { ExchangeAddress, ExchangeABI } from "@/constants"; 

// Function to remove liquidity to the ETH/XLA pool
async function removeLiquidity(
    lpAmountToBurn,
    setOpenPopUp,
    setIsRemoving,
    setLpAmountToBurn
) {
        
    try {
        // Remove the liquidity by burning the LP Token
        const { request } = await prepareWriteContract({
            address: ExchangeAddress,
            abi: ExchangeABI,
            functionName: 'removeLiquidity',
            args: [parseEther(lpAmountToBurn)],
        });
        const hash = await writeContract(request);
        await waitForTransaction(hash);
        setIsRemoving(false);

        // Finally close AddLiquidity PopUp
        setLpAmountToBurn(0);
        setOpenPopUp(false);

    } catch (error) {
        console.error(error);
        window.alert(error);
        setIsRemoving(false);
    }

}

export default function RemoveLiquidityComponent() {

    // Check if the users's wallet is connected or disconnected, store its address (Wagmi hooks) 
    const { address, isConnected } = useAccount();

    const [ openPopUp, setOpenPopUp ]   = useState(false);
    const [ isRemoving, setIsRemoving ] = useState(false);

    // Fetch the Pool ETH Reserve
    const ethReserve = useBalance({
        address: ExchangeAddress,
        watch: true,
    });

    // Fetch the Pool XLA Reserve
    const xelaReserve = useContractRead({
        address: ExchangeAddress,
        abi: ExchangeABI,
        functionName: 'getXelaReserve',
        watch: true,
    });

    // Fetch the lpETHXELA token hold by the user 
    const userLpToken = useContractRead({
        address: ExchangeAddress,
        abi: ExchangeABI,
        functionName: 'balanceOf',
        args: [address],
        watch: true,
    });

    // Fetch the lpETHXELA total supply
    const totalLpToken = useContractRead({
        address: ExchangeAddress,
        abi: ExchangeABI,
        functionName: 'totalSupply',
        watch: true,
    });

    // State variable for conditional CSS
    const [ exceedLp, setExceedLp ] = useState(false);

    // State variable for LP amount to burn
    const [ lpAmountToBurn, setLpAmountToBurn ] = useState(0);
    // State variables to calculate the amount of ETH and XLA to return
    const [ xlaToReturn, setXlaToReturn ] = useState(0);
    const [ ethToReturn, setEthToReturn ] = useState(0);

    // useEffect to change input color when it exceeds the user's balance
    useEffect(() => {
        if (userLpToken.data) {
            if (lpAmountToBurn > formatEther(userLpToken.data)) {
                setExceedLp(true);
            } else {
                setExceedLp(false);
            }
        }
    }, [lpAmountToBurn]);

    // Adding XLA also add ETH (amount to be calculated to keep a constant ratio)
    const handleLpInputChange = (event) => {
        if (totalLpToken.data && xelaReserve.data && ethReserve.data) {
            setLpAmountToBurn(Number(event.target.value));
            setXlaToReturn(formatEther(xelaReserve.data) * (event.target.value / formatEther(totalLpToken.data)));
            setEthToReturn(formatEther(ethReserve.data.value) * (event.target.value / formatEther(totalLpToken.data)));
        }
    };

    return (
        <>
            {!openPopUp ? (
                <div className={styles.addLiquidityButton}>
                    <button className={styles.addLiquidityButton}
                            onClick={() => {
                                if (isConnected) {
                                    setOpenPopUp(true);
                                } else {
                                    window.alert("Wallet Not Connected. Impossible to add liquidity");
                                }
                            }}
                    >
                        - Remove Liquidity
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.addLiquidityButton}>
                        <button onClick={() => setOpenPopUp(true)} className={styles.addLiquidityButton}>Removing Liquidity...</button>
                    </div>
                    <Popup open={openPopUp} closeOnDocumentClick={false}>
                        <div className={styles.popupContainer}>
                            <button className={styles.close} onClick={() => setOpenPopUp(false)}>
                                &times;
                            </button>
                            <div className={styles.header}>Remove <span className={styles.pairColor}>ETH/XLA</span> Liquidity</div>
                            <div className={styles.content}>
                                <div className={styles.infoContainer}>
                                    <p>How much lpETHXELA do you want to burn?</p>
                                </div>
                                <div className={styles.addTokenDiv}>
                                    <div className={styles.lpName}>lpETHXELA</div>
                                    <div className={styles.addTokenContainer}>
                                        <input
                                            className={exceedLp ? styles.xlaInputExceeded : styles.xlaInputNotExceeded}
                                            type="number"
                                            spellCheck={false} 
                                            placeholder="Enter Amount"
                                            value={lpAmountToBurn === 0 ? null : lpAmountToBurn}
                                            onChange={handleLpInputChange}
                                        >
                                        </input>
                                        <p>lpETHXELA balance: {
                                            userLpToken.data && (roundNumber(Number(formatEther(userLpToken.data))))
                                        }
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.burnInsightDiv}>
                                        <div className={styles.ethToReturn}>
                                            <span className={styles.textColor}>ETH you will receive:</span>
                                            <span className={styles.tokenColor}>
                                                { (ethToReturn === 0 || exceedLp) ? "-" : (roundNumber(ethToReturn) + "ETH")}
                                            </span>
                                        </div>
                                        <div className={styles.xlaToReturn}>
                                            <span className={styles.textColor}>XLA you will receive:</span>
                                            <span className={styles.tokenColor}>
                                                {(xlaToReturn === 0 || exceedLp) ? "-" : (roundNumber(xlaToReturn) + "XLA")}
                                            </span>
                                        </div>
                                </div>
                                <div className={styles.buttonContainer}>
                                    {!isRemoving ? (
                                        <>
                                            <button className={styles.button} 
                                                    onClick={() => {
                                                        if (lpAmountToBurn == 0) {
                                                            window.alert("Amount to burn not set. Please enter the amount of lpETHXELA you would like to burn.");
                                                        } else {
                                                            setIsRemoving(true);
                                                            removeLiquidity(
                                                                lpAmountToBurn.toString(),
                                                                setOpenPopUp,
                                                                setIsRemoving,
                                                                setLpAmountToBurn
                                                            );
                                                        }
                                                    }}
                                            >
                                                Remove Liquidity
                                            </button>
                                            <button className={styles.button}
                                                    onClick={() => setOpenPopUp(false)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : isRemoving && (
                                        <button className={styles.buttonWhenAdding}>
                                            <p>Removing...</p>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Popup>
                </>
            )}
        </>
        
    )
}