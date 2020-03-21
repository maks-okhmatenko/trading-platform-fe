import * as React from 'react';

import styles from './CurrencyDetails.scss';

const CurrencyDetails = (props) => {

  return (
    <div className={styles.currencyDetailsWrap}>
      <div className={styles.widgetHeader}>
        <span className={styles.headerText}>details</span>
      </div>

      <div className={styles.widgetData}>
        widget data
      </div>
    </div>
  );
};

export default CurrencyDetails;
