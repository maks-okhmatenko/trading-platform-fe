import * as React from 'react';
import CurrencyWidgetHeader from './components/CurrencyWidgetHeader';
import CurrencyItems from './components/CurrencyItems';
import { connect } from 'react-redux';
import {
  makeSelectTickers,
  makeSelectLoading,
  makeSelectFavoriteTickers,
  makeSelectGlobalSymbolList,
  makeSelectOrdersLoading,
  makeSelectLogin,
  makeSelectOpenOrderError,
} from 'containers/App/selectors';
import { createStructuredSelector } from 'reselect';

import styles from './CurrencyWidget.scss';

const CurrencyWidget = (props) => {
  const {
    loading,
    tickers,
    favoriteTickers,
    globalSymbolList,
    login,
    isOrderLoading,
    openOrderError,
  } = props;

  // - props
  const currencyWidgetProps = {
    favoriteTickers,
    symbolList: globalSymbolList,
  };

  const currencyItemsProps = {
    favoriteTickers,
    list: tickers,
    login,
    isOrderLoading,
    openOrderError,
  };

  // - render
  return (
    <div className={styles.currencyWidget}>
      <CurrencyWidgetHeader {...currencyWidgetProps}/>

      {loading ? (
        <span>Loading...</span>
      ) : null}

      {tickers && !loading ? (
        <CurrencyItems {...currencyItemsProps}/>
      ) : null}
    </div>
  );
};


const mapStateToProps = createStructuredSelector({
  tickers: makeSelectTickers(),
  loading: makeSelectLoading(),
  favoriteTickers: makeSelectFavoriteTickers(),
  globalSymbolList: makeSelectGlobalSymbolList(),
  isOrderLoading: makeSelectOrdersLoading(),
  openOrderError: makeSelectOpenOrderError(),
  login: makeSelectLogin(),
});

const mapDispatchToProps = {

};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrencyWidget);
