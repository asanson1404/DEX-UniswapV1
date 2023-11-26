import DropDownButton from "./DropDownButton";
import { useState } from "react";
import styles from './style.module.css';

function Swapper() {

    var c;

    const [selectedToken, setSelectedToken] = useState('XLA');

    return (
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
    )

}

export default Swapper;