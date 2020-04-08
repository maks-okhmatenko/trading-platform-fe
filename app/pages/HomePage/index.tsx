import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect, useStore } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import appReducer from 'containers/App/reducer';
import {
  makeSelectActiveTimeFrame,
  makeSelectActiveSymbolChart,
  makeSelectChartLoading,
  makeSelectChartData,
  makeSelectLoading,
  makeSelectTickers,
  makeSelectAdditionalChartDataLength,
} from 'containers/App/selectors';
import { useInjectReducer } from 'utils/injectReducer';

import CurrencyWidgetContainer from 'components/ui/CurrencyWidget';
import CurrencyDetailsWidgetContainer from 'components/ui/CurrencyDetails';
import styles from './styles.scss';
import Chart from '../../components/ui/StockChart';
import {
  socketIoSubscribeTimeframe,
  socketIoLoadTimeFrameByCount,
  changeActiveTimeFrame,
} from '../../containers/App/actions';

const HomePageContainer = props => {
  const { loading, tickers } = props;
  useInjectReducer({ key: 'app', reducer: appReducer });

  const currencyWidgetProps = {
    loading,
    tickers,
  };

  const chartProps = {
    chartData: props.chartTimeFrame,
    additionalChartDataLength: props.additionalChartDataLength,
    chartLoading: props.chartLoading,
    activeSymbolChart: props.activeSymbolChart,
    activeTimeFrame: props.activeTimeFrame,
    pickTimeFrame: props.pickTimeFrame,
    subscribeChartData: props.subscribeChartData,
    loadMoreChartData: props.loadMoreChartData,
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

      <div className={styles.chartSection}>
        {props.activeSymbolChart ? <Chart type="hybrid" {...chartProps} /> : <></>}
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  tickers: makeSelectTickers(),
  loading: makeSelectLoading(),
  chartLoading: makeSelectChartLoading(),
  chartTimeFrame: makeSelectChartData(),
  additionalChartDataLength: makeSelectAdditionalChartDataLength(),
  activeSymbolChart: makeSelectActiveSymbolChart(),
  activeTimeFrame: makeSelectActiveTimeFrame(),
});

const mapDispatchToProps = {
  subscribeChartData: socketIoSubscribeTimeframe,
  loadMoreChartData: socketIoLoadTimeFrameByCount,
  pickTimeFrame: changeActiveTimeFrame,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePageContainer);
