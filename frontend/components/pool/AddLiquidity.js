import styles from './style.module.css';
import Popup from 'reactjs-popup';
import { useEffect, useState } from 'react';
import config from '../../wagmi.config';
import { useAccount, useBalance, useReadContract, useBlockNumber } from 'wagmi';
import { simulateContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { formatEther, parseEther } from 'viem'
import { IoMdInformationCircleOutline } from "react-icons/io";
import { roundNumber } from './Pool';
import {    XelaTokenAddress, XelaTokenABI,
            ExchangeAddress, ExchangeABI
} from "@/constants"; 

// Function to add liquidity to the ETH/XLA pool
async function addLiquidity(
    amountOfXela,
    amountOfEth,
    setOpenPopUp,
    setIsAdding,
    setIsApproving,
    setRightEthAmount,
    setRightXlaAmount,
    setRoundedEthAmount,
    setRoundedXlaAmount,
) {
        
    try {

        // First approve the Exchange Contract as a spender
        // The amount of the allowance is the amount the user would like to add
        const { request: request1 } = await simulateContract(config, {
            address: XelaTokenAddress,
            abi: XelaTokenABI,
            functionName: 'approve',
            args: [ExchangeAddress, parseEther(amountOfXela)],
        });
        setIsApproving(true);
        const hash1 = await writeContract(config, request1);
        await waitForTransactionReceipt(config, {
            hash: hash1,
        });
        setIsApproving(false);
        
        // Then add the liquidity
        setIsAdding(true);
        const { request: request2 } = await simulateContract(config, {
            address: ExchangeAddress,
            abi: ExchangeABI,
            functionName: 'addLiquidity',
            args: [parseEther(amountOfXela)],
            value: parseEther(amountOfEth),
        });
        const hash2 = await writeContract(config, request2);
        await waitForTransactionReceipt(config, {
            hash: hash2,
        });
        setIsAdding(false);

        // Finally close AddLiquidity PopUp
        setRightEthAmount(0);
        setRightXlaAmount(0);
        setRoundedEthAmount(0);
        setRoundedXlaAmount(0);
        setOpenPopUp(false);

    } catch (error) {
        console.error(error);
        window.alert(error);
        setIsAdding(false);
        setIsApproving(false);
    }

}

// Info Popup Component
const InfoPopUp = () => {

    const [ openInfoPopUp, setOpenInfoPopup] = useState(false);

    return (
        <Popup
            trigger={
                <div>
                    <IoMdInformationCircleOutline   className={styles.infoButton}
                                                    onMouseEnter={() => setOpenInfoPopup(true)}
                                                    onMouseLeave={() => setOpenInfoPopup(false)}
                    >
                    </IoMdInformationCircleOutline>
                </div>
            }
            open={openInfoPopUp}
            closeOnDocumentClick
            position="right top"
        >
            <div className={styles.infoPopUpContent}>
                <p className={styles.infoMessage}>As the pool ratio must remain constant, entering the amount of <span className={styles.pairColor}><b>XLA</b></span> to be added
                                                  will automatically determine the corresponding quantity of <span className={styles.pairColor}><b>ETH</b></span> also to be added, and vice versa.</p>
            </div>
        </Popup>
    );
}

export default function AddLiquidityComponent() {

    // Listen for block number changes
    const { data: blockNumber } = useBlockNumber({ watch: true });

    // Check if the users's wallet is connected or disconnected, store its address (Wagmi hooks) 
    const { address, isConnected } = useAccount();

    const [ openPopUp, setOpenPopUp ]       = useState(false);
    const [ isApproving, setIsApproving ]   = useState(false);
    const [ isAdding, setIsAdding ]         = useState(false);

    // Fetch user ETH Balance
    const ethUserBalance = useBalance({
        address: address,
    });

    // Fetch user XLA Balance
    const xlaUserBalance = useReadContract({
        address: XelaTokenAddress,
        abi: XelaTokenABI,
        functionName: 'balanceOf',
        args: [address],
    });

    // Fetch the Pool ETH Reserve
    const ethReserve = useBalance({
        address: ExchangeAddress,
    });

    // Fetch the Pool XLA Reserve
    const xelaReserve = useReadContract({
        address: ExchangeAddress,
        abi: ExchangeABI,
        functionName: 'getXelaReserve',
    });

    // Refetch read data at every new blocknumber
    useEffect(() => { 
        ethUserBalance.refetch();
        xlaUserBalance.refetch();
        ethReserve.refetch();
        xelaReserve.refetch();
    }, [blockNumber]) 

    // State variable for conditional CSS
    const [ exceedXla, setExceedXla ] = useState(false);
    const [ exceedEth, setExceedEth ] = useState(false);

    // State variables to calculate the right amount of token to add to the Pool
    const [ rightXlaAmount, setRightXlaAmount ] = useState(0);
    const [ rightEthAmount, setRightEthAmount ] = useState(0);
    // State variables to round the amount of token to add to the Pool
    const [ roundedXlaAmount, setRoundedXlaAmount ] = useState(0);
    const [ roundedEthAmount, setRoundedEthAmount ] = useState(0);

    // useEffect to change input color when it exceeds the user's balance
    useEffect(() => {
        if (xlaUserBalance.data) {
            if (rightXlaAmount > formatEther(xlaUserBalance.data)) {
                setExceedXla(true);
            } else {
                setExceedXla(false);
            }
        }
    }, [rightXlaAmount]);

    // useEffect to change input color when it exceeds the user's balance
    useEffect(() => {
        if (ethUserBalance.data) {
            if (rightEthAmount > parseFloat(formatEther(ethUserBalance.data.value))) {
                setExceedEth(true);
            } else {
                setExceedEth(false);
            }
        }
    }, [rightEthAmount]);

    // Adding XLA also add ETH (amount to be calculated to keep a constant ratio)
    const handleXlaInputChange = (event) => {
        if (ethReserve.data && xelaReserve.data) {
            setRightXlaAmount(Number(event.target.value));
            setRightEthAmount(event.target.value * formatEther(ethReserve.data.value) / formatEther(xelaReserve.data));
            setRoundedXlaAmount(Number(event.target.value));
            setRoundedEthAmount(roundNumber(event.target.value * formatEther(ethReserve.data.value) / formatEther(xelaReserve.data)));
        }
    };
    // Adding ETH also add XLA (amount to be calculated to keep a constant ratio)
    const handleEthInputChange = (event) => {
        if (xelaReserve.data && ethReserve.data) {
            setRightEthAmount(Number(event.target.value));
            setRightXlaAmount(event.target.value * formatEther(xelaReserve.data) / formatEther(ethReserve.data.value));
            setRoundedEthAmount(Number(event.target.value));
            setRoundedXlaAmount(roundNumber(event.target.value * formatEther(xelaReserve.data) / formatEther(ethReserve.data.value)));
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
                        + Add Liquidity
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.addLiquidityButton}>
                        <button onClick={() => setOpenPopUp(true)} className={styles.addLiquidityButton}>Adding Liquidity...</button>
                    </div>
                    <Popup open={openPopUp} closeOnDocumentClick={false}>
                        <div className={styles.popupContainer}>
                            <button className={styles.close} onClick={() => setOpenPopUp(false)}>
                                &times;
                            </button>
                            <div className={styles.header}>Add <span className={styles.pairColor}>ETH/XLA</span> Liquidity</div>
                            <div className={styles.content}>
                                <div className={styles.infoContainer}>
                                    <p>How much XLA do you want to add?</p>
                                    <InfoPopUp/>
                                </div>
                                <div className={styles.addTokenDiv}>
                                    <div className={styles.xlaName}>XLA</div>
                                    <div className={styles.addTokenContainer}>
                                        <input
                                            className={exceedXla ? styles.xlaInputExceeded : styles.xlaInputNotExceeded}
                                            type="number"
                                            spellCheck={false} 
                                            placeholder="Enter Amount"
                                            value={roundedXlaAmount === 0 ? null : roundedXlaAmount}
                                            onChange={handleXlaInputChange}
                                        >
                                        </input>
                                        <p>XLA balance: {
                                            xlaUserBalance.data ? (
                                                roundNumber(Number(formatEther(xlaUserBalance.data)))
                                            ) : (
                                                0
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.infoContainer}>
                                    <p>ETH will also be added to maintain a constant ratio:</p>
                                    <InfoPopUp/>
                                </div>
                                <div className={styles.addTokenDiv}>
                                    <div className={styles.xlaName}>ETH</div>
                                    <div className={styles.addTokenContainer}>
                                        <input
                                            className={exceedEth ? styles.ethInputExceeded : styles.ethInputNotExceeded}
                                            type="number"
                                            spellCheck={false} 
                                            placeholder="Enter Amount"
                                            value={roundedEthAmount === 0 ? null : roundedEthAmount}
                                            onChange={handleEthInputChange}
                                        >
                                        </input>
                                        <p>ETH balance: {
                                            ethUserBalance.data ? (
                                                roundNumber(Number(formatEther(ethUserBalance.data.value)))
                                            ) : (
                                                0
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.buttonContainer}>
                                    {(!isApproving && !isAdding) ? (
                                        <>
                                            <button className={styles.button} 
                                                    onClick={() => {
                                                        if (rightEthAmount == 0 || rightXlaAmount == 0) {
                                                            window.alert("Amount to add not set. Please enter the amount of ETH and XLA you would like to add into the pool.");
                                                        } else {
                                                            setIsAdding(true);
                                                            addLiquidity(
                                                                rightXlaAmount.toString(),
                                                                rightEthAmount.toString(),
                                                                setOpenPopUp,
                                                                setIsAdding,
                                                                setIsApproving,
                                                                setRightEthAmount,
                                                                setRightXlaAmount,
                                                                setRoundedEthAmount,
                                                                setRoundedXlaAmount
                                                            );
                                                        }
                                                    }}
                                            >
                                                Add Liquidity
                                            </button>
                                            <button className={styles.button}
                                                    onClick={() => setOpenPopUp(false)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : isApproving ? (
                                        <button className={styles.buttonWhenAdding}>
                                            <p>Approving...</p>
                                        </button>
                                    ) : isAdding && (
                                        <button className={styles.buttonWhenAdding}>
                                            <p>Adding...</p>
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