import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
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
  makeSelectOpenedSymbols,
  makeSelectFavoriteTickers,
} from 'containers/App/selectors';
import { useInjectReducer } from 'utils/injectReducer';

import CurrencyWidgetContainer from 'components/ui/CurrencyWidget';
import Chart from 'components/ui/StockChart';
import OrderList from 'components/ui/OrderList';
import {
  changeActiveSymbolChart,
  socketIoSubscribeTimeframeInitByCount,
  socketIoLoadTimeFrameByCount,
  changeActiveTimeFrame,
} from 'containers/App/actions';
import { CHANGE_TYPE } from 'containers/App/constants';

import styles from './styles.scss';

const HomePageContainer = props => {
  const {
    tickers,
    favoriteTickers,
    additionalChartDataLength,
    activeTimeFrame,
    chartLoading,
    activeSymbolChart,
    chartData,
    pickTimeFrame,
    subscribeChartData,
    loadMoreChartData,
    openedSymbols,
    pickSymbolChart,
  } = props;

  useInjectReducer({ key: 'app', reducer: appReducer });

  if (!props.activeSymbolChart && favoriteTickers.length) {
    props.pickSymbolChart(CHANGE_TYPE.ADD, favoriteTickers[0]);
  }

  const chartProps = {
    ticker: tickers[activeSymbolChart],
    additionalChartDataLength,
    activeTimeFrame,
    chartLoading,
    activeSymbolChart,
    chartData,
    pickTimeFrame,
    subscribeChartData,
    loadMoreChartData,
    openedSymbols,
    pickSymbolChart,
  };

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A React.js Boilerplate application homepage" />
      </Helmet>

      <div className={styles.bodyContainer}>
        <div className={styles.chartSection}>
          <div className={styles.widgetContainer}>
            <CurrencyWidgetContainer />
          </div>
          {props.activeSymbolChart ? <Chart type="svg" {...chartProps} /> : null}
        </div>
        <div className={styles.ordersSection}>
          <OrderList />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  tickers: makeSelectTickers(),
  loading: makeSelectLoading(),
  chartLoading: makeSelectChartLoading(),
  chartData: makeSelectChartData(),
  additionalChartDataLength: makeSelectAdditionalChartDataLength(),
  activeSymbolChart: makeSelectActiveSymbolChart(),
  activeTimeFrame: makeSelectActiveTimeFrame(),
  openedSymbols: makeSelectOpenedSymbols(),
  favoriteTickers: makeSelectFavoriteTickers(),
});

const mapDispatchToProps = {
  subscribeChartData: socketIoSubscribeTimeframeInitByCount,
  loadMoreChartData: socketIoLoadTimeFrameByCount,
  pickTimeFrame: changeActiveTimeFrame,
  pickSymbolChart: changeActiveSymbolChart,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePageContainer);
