import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import appReducer from 'containers/App/reducer';
import {
  makeSelectActiveSymbolChart,
  makeSelectChartLoading,
  makeSelectChartTimeFrame,
  makeSelectLoading,
  makeSelectTickers,
  makeSelectTickersIo,
} from 'containers/App/selectors';
import { useInjectReducer } from 'utils/injectReducer';

import CurrencyWidgetContainer from 'components/ui/CurrencyWidget';
import CurrencyDetailsWidgetContainer from 'components/ui/CurrencyDetails';
import styles from './styles.scss';
import Chart from '../../components/ui/Chart';

const HomePageContainer = (props) => {
  const { loading, tickers } = props;
  useInjectReducer({ key: 'app', reducer: appReducer });

  const currencyWidgetProps = {
    loading,
    tickers,
  };

  const chartProps = {
    chartTimeFrame: props.chartTimeFrame,
    chartLoading: props.chartLoading,
    activeSymbolChart: props.activeSymbolChart,
  };

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
        <CurrencyWidgetContainer {...currencyWidgetProps} />
        <CurrencyDetailsWidgetContainer />
      </div>

      <section className={styles.chartSection}>
        {!props.chartLoading ? <Chart {...chartProps} /> : 'loading...'}
      </section>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  tickers: makeSelectTickers(),
  loading: makeSelectLoading(),
  chartLoading: makeSelectChartLoading(),
  tickersIo: makeSelectTickersIo(),
  chartTimeFrame: makeSelectChartTimeFrame(),
  activeSymbolChart: makeSelectActiveSymbolChart(),
});


export default connect(mapStateToProps)(HomePageContainer);
