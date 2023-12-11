import styles from './style.module.css';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { IoMdInformationCircleOutline } from "react-icons/io";

// Function to add liquidity to the ETH/XLA pool
async function addLiquidity(amountOfXela) {
    
    if (!isConnected) {
        window.alert("Wallet not Connected");
    } else {
        
        setIsAdding(true);

        try {
            // First approve the Exchange Contract as a spender
            // The amount of the allowance is the amount the user would like to add
            const hash1 = await writeContract({
                address: XelaTokenAddress,
                abi: XelaTokenABI,
                functionName: 'approve',
                args: [ExchangeAddress, amountOfXela],
            });
            await waitForTransaction(hash1);

            // Then add the liquidity
            const hash2 = await writeContract({
                address: ExchangeAddress,
                abi: ExchangeABI,
                functionName: 'addLiquidity',
                args: [amountOfXela],
            });
            await waitForTransaction(hash2);

        } catch (error) {
            console.error(error);
            window.alert(error);
        }

        setIsAdding(false);

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

    // Check if the users's wallet is connected or disconnected, store its address (Wagmi hooks) 
    const { address, isConnected } = useAccount();

    const [ openPopUp, setOpenPopUp ] = useState(false);
    const [ isAdding, setIsAdding ] = useState(false);

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
                                            type="number" 
                                            spellCheck={false} 
                                            placeholder="Enter Amount"
                                            >
                                        </input>
                                        <p>XLA balance:</p>
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
                                            type="number" 
                                            spellCheck={false} 
                                            placeholder="Enter Amount"
                                            >
                                        </input>
                                        <p>ETH balance:</p>
                                    </div>
                                </div>
                                <div className={styles.buttonContainer}>
                                    {!isAdding ? (
                                        <>
                                            <button className={styles.button} 
                                                    onClick={() => {

                                                        setIsAdding(true);
                                                        //await add();
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
                                    ) : (
                                        <button className={styles.buttonWhenAdding}>
                                            Adding...
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