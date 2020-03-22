import * as React from 'react';
import CurrencyWidgetHeader from './components/CurrencyWidgetHeader';
import CurrencyItems from './components/CurrencyItems';

import styles from './CurrencyWidget.scss';

const CurrencyWidget = ({ tickers, loading }) => {
  return (
    <div className={styles.currencyWidget}>

      <CurrencyWidgetHeader />

      {loading ? (
        <span>Loading...</span>
      ) : null}

      {tickers && !loading ? (
        <CurrencyItems list={tickers} />
      ) : null}

    </div>
  );
};

export default CurrencyWidget;
