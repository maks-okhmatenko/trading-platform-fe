import * as React from 'react';

import styles from './CurrencyWidgetHeader.scss';

const CurrencyWidgetHeader = (props) => {

  return (
    <div className={styles.currencyWidgetHeader}>

      <div className={styles.mainSectionWrap}>
        <span className={styles.widgetHeader}>WATCHLIST</span>
        <input type="input" placeholder="BTCETH ..." className={styles.searchInput} />
      </div>

      <div className={styles.subSectionWrap}>
        <ul className={styles.tableTitle}>
          <li>Symbol</li>
          <li>Last</li>
          <li>Chng (%)</li>
        </ul>
      </div>

    </div>
  );
};

export default CurrencyWidgetHeader;
