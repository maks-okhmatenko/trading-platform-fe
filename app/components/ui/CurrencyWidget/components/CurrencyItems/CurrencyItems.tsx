import * as React from 'react';

import styles from './CurrencyItems.scss';

function getRandomIntInclusive(min, max, fixed?: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Number(Math.random() * (max - min + 1)).toFixed(fixed);

}

const CurrencyItems = (props) => {

  return (
    <div className={styles.currencyItemsWrap}>
      <ul className={styles.currencyList}>
        {
          props.currecnyData.item.map((item, index) => {
            return (
              <li className={styles.currencyItem} key={item.symbol}>
                <div className={styles.currencySymbol}>{`${item.symbol} / ${item.currency}`}</div>
                <div className={styles.lastMarket}>{getRandomIntInclusive(0, 10, 5)}</div>
                <div className={styles.percentChange}>{getRandomIntInclusive(-5, 5, 2)}%</div>
                <span className={styles.closeIcon} />
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default CurrencyItems;
