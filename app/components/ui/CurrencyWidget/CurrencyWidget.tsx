import * as React from 'react';
import CurrencyWidgetHeader from './components/CurrencyWidgetHeader';
import CurrencyItems from './components/CurrencyItems';

import styles from './CurrencyWidget.scss';

const CurrencyWidget = (props) => {

  return (
    <div className={styles.currencyWidget}>

      <CurrencyWidgetHeader/>

      <CurrencyItems {...props} />

    </div>
  );
};

export default CurrencyWidget;
