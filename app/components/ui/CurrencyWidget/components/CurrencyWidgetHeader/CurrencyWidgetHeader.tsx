import * as React from 'react';

import styles from './CurrencyWidgetHeader.scss';
import { useDispatch } from 'react-redux';

const CurrencyWidgetHeader = (props) => {

  return (
    <>
      <div className={styles.currencyWidgetHeader}>
        <div className={styles.mainSectionWrap}>
          <span className={styles.widgetHeader}>WATCHLIST</span>
          {/*<input type="input" placeholder="BTCETH ..." className={styles.searchInput} />*/}
        </div>
      </div>
      <div className={styles.subSectionWrap}>
        <ul className={styles.tableTitle}>
          <li>Symbol</li>
          <li>Bid</li>
          <li>Aks</li>
          <li>!</li>
          <li>Time</li>
        </ul>
      </div>
    </>
  );
};

export default CurrencyWidgetHeader;
