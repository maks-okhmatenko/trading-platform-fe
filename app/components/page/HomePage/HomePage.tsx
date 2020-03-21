import * as React from 'react';
import CurrencyDetailsWidgetContainer from '../../../containers/CurrencyDetailsWidget';
import CurrencyWidgetContainer from '../../../containers/CurrencyWidget';

import styles from './HomePage.scss';

const HomePage = (props) => {

  return (
    <article className={styles.homeContainer}>

      <div className={styles.widgetContainer}>
        <CurrencyWidgetContainer {...props} />
        <CurrencyDetailsWidgetContainer/>
      </div>

      <section>

        <div>
          tabs
        </div>

      </section>

    </article>
  );
};

export default HomePage;
