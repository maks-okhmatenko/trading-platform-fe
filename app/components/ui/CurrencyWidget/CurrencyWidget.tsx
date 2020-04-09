import * as React from 'react';
import CurrencyWidgetHeader from './components/CurrencyWidgetHeader';
import CurrencyItems from './components/CurrencyItems';

import styles from './CurrencyWidget.scss';

const CurrencyWidget = ({ tickers, loading, allTickersShow, favoriteTickers }) => {
  const [filter, setFilter] = React.useState('');
  return (
    <div className={styles.currencyWidget}>

      <CurrencyWidgetHeader allTickersShow={allTickersShow} onFilterSet={setFilter}/>

      {loading ? (
        <span>Loading...</span>
      ) : null}

      {tickers && !loading ? (
        <CurrencyItems list={tickers} favoriteTickers={favoriteTickers} filter={filter}/>
      ) : null}

    </div>
  );
};

export default CurrencyWidget;
