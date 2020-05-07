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
  makeSelectGlobalSymbolList,
  makeSelectLogin,
  makeSelectOrdersLoading,
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
import styles from './styles.scss';

const HomePageContainer = props => {
  const { loading, tickers, allTickersShow, favoriteTickers, isOrderLoading, login } = props;
  useInjectReducer({ key: 'app', reducer: appReducer });

  const currencyWidgetProps = {
    loading,
    tickers,
    allTickersShow,
    favoriteTickers,
    globalSymbolList: props.globalSymbolList,
    login,
    isOrderLoading,
  };

  const chartProps = {
    ticker: tickers[props.activeSymbolChart],
    chartData: props.chartTimeFrame,
    additionalChartDataLength: props.additionalChartDataLength,
    chartLoading: props.chartLoading,
    activeSymbolChart: props.activeSymbolChart,
    activeTimeFrame: props.activeTimeFrame,
    pickTimeFrame: props.pickTimeFrame,
    subscribeChartData: props.subscribeChartData,
    loadMoreChartData: props.loadMoreChartData,
    openedSymbols: props.openedSymbols,
    pickSymbolChart: props.pickSymbolChart,
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
            <CurrencyWidgetContainer {...currencyWidgetProps} />
          </div>
          {props.activeSymbolChart ? <Chart type="svg" {...chartProps} /> : <></>}
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
  chartTimeFrame: makeSelectChartData(),
  additionalChartDataLength: makeSelectAdditionalChartDataLength(),
  activeSymbolChart: makeSelectActiveSymbolChart(),
  activeTimeFrame: makeSelectActiveTimeFrame(),
  openedSymbols: makeSelectOpenedSymbols(),
  favoriteTickers: makeSelectFavoriteTickers(),
  globalSymbolList: makeSelectGlobalSymbolList(),
  isOrderLoading: makeSelectOrdersLoading(),
  login: makeSelectLogin(),
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
