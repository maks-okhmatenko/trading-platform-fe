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
  makeSelectOpenedSymbols,
  makeSelectFavoriteTickers,
  makeSelectGlobalSymbolList,
} from 'containers/App/selectors';
import { useInjectReducer } from 'utils/injectReducer';

import CurrencyWidgetContainer from 'components/ui/CurrencyWidget';
import styles from './styles.scss';
import Chart from '../../components/ui/StockChart';
import { changeActiveSymbolChart } from 'containers/App/actions';
import {
  socketIoSubscribeTimeframe,
  socketIoLoadTimeFrameByCount,
  changeActiveTimeFrame,
} from '../../containers/App/actions';
import { OrderList, PropsType as OrdersProps } from 'components/ui/OrderList/OrderList';

const HomePageContainer = props => {
  const { loading, tickers, allTickersShow, favoriteTickers } = props;
  useInjectReducer({ key: 'app', reducer: appReducer });

  const currencyWidgetProps = {
    loading,
    tickers,
    allTickersShow,
    favoriteTickers,
    globalSymbolList: props.globalSymbolList,
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

  const ordersProps: OrdersProps = {
    itemList: [],
    loading: false,
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

      <div className={styles.bodyContainer}>
        <div className={styles.chartSection}>
          <div className={styles.widgetContainer}>
            <CurrencyWidgetContainer {...currencyWidgetProps} />
          </div>
          {props.activeSymbolChart ? <Chart type="svg" {...chartProps} /> : <></>}
        </div>
        <div className={styles.ordersSection}>
          <OrderList {...ordersProps} />
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
});

const mapDispatchToProps = {
  subscribeChartData: socketIoSubscribeTimeframe,
  loadMoreChartData: socketIoLoadTimeFrameByCount,
  pickTimeFrame: changeActiveTimeFrame,
  pickSymbolChart: changeActiveSymbolChart,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePageContainer);
