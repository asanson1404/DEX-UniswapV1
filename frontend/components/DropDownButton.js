import Dropdown from 'react-dropdown';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import styles from './style.module.css'

function DropDownButton({selectedToken, setSelectedToken}) {

  const tokens = ['ETH', 'XLA'];

  return (
    <Dropdown
        className={styles.dropdownContainer}
        controlClassName={styles.dropdownControl}
        menuClassName={styles.dropdownMenu}
        options={tokens}
        placeholder={selectedToken}
        arrowClosed={<IoMdArrowDropdown/>}
        arrowOpen={<IoMdArrowDropup/>}
        onChange={(token) => {
            setSelectedToken(token.value);
        }}
    />
  );
}

export default DropDownButton;