import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect, useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import appReducer from 'containers/App/reducer';
import { makeSelectLoading, makeSelectTickers } from 'containers/App/selectors';
import { useInjectReducer } from 'utils/injectReducer';

import CurrencyWidgetContainer from 'components/ui/CurrencyWidget';
import CurrencyDetailsWidgetContainer from 'components/ui/CurrencyDetails';
import styles from './styles.scss';

const HomePageContainer = ({ loading, tickers }) => {
  useInjectReducer({ key: 'app', reducer: appReducer });

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>

      <div className={styles.widgetContainer}>
        <CurrencyWidgetContainer loading={loading} tickers={tickers} />
        <CurrencyDetailsWidgetContainer />
      </div>

      <section>
        <p>tabs</p>
      </section>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  tickers: makeSelectTickers(),
  loading: makeSelectLoading(),
});


export default connect(mapStateToProps)(HomePageContainer);
