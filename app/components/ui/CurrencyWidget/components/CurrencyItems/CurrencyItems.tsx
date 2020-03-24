import * as React from 'react';
import classnames from 'classnames';
import styles from './CurrencyItems.scss';

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
        {Object.keys(list).map((item, index) => {
          const ticker = list[item];
          const direction = ticker.Direction;

          const classNames = classnames(styles.currencyItem, {
            [styles.up]: direction === '1',
            [styles.down]: direction === '0',
          });

          return (
            <li className={classNames} key={index}>
              <div className={styles.currencySymbol}>{item.toUpperCase()}</div>
              <div className={styles.lastMarket}>{ticker.Bid}</div>
              <div className={styles.percentChange}>--</div>
              <span className={styles.closeIcon} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CurrencyItems;
