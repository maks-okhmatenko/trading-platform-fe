import * as React from 'react';

import styles from './CurrencyItems.scss';

function getRandomIntInclusive(min, max, fixed?: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Number(Math.random() * (max - min + 1)).toFixed(fixed);

}

// Symbol: "USOile"
// Bid: "0"
// Ask: "0"
// Direction: "2"
// Spread: "0"
// Digits: "2"

const CurrencyItems = ({ list }) => {
  return (
    <div className={styles.currencyItemsWrap}>
      <ul className={styles.currencyList}>
        {list.map((item, index) => (
          <li className={styles.currencyItem} key={index}>
            <div className={styles.currencySymbol}>{item.Symbol.toUpperCase()}</div>
            <div className={styles.lastMarket}>{item.Bid}</div>
            <div className={styles.percentChange}>{NaN}%</div>
            <span className={styles.closeIcon} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrencyItems;
