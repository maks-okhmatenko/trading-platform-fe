import * as React from 'react';
import CurrencyWidgetHeader from './components/CurrencyWidgetHeader';
import CurrencyItems from './components/CurrencyItems';

import styles from './CurrencyWidget.scss';

const CurrencyWidget = ({ tickers, loading, globalSymbolList, favoriteTickers }) => {

  return (
    <div className={styles.currencyWidget}>

      <CurrencyWidgetHeader
        favoriteTickers={favoriteTickers}
        symbolList={globalSymbolList}
      />

      {loading ? (
        <span>Loading...</span>
      ) : null}

      {tickers && !loading ? (
        <CurrencyItems
          favoriteTickers={favoriteTickers}
          list={tickers}
        />
      ) : null}

    </div>
  );
};

export default CurrencyWidget;
