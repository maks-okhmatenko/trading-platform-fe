/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectError, makeSelectLoading } from 'containers/App/selectors';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
import HomePage from '../../components/page/HomePage';

import styles from './HomePage.scss';

const key = 'home';

const stateSelector = createStructuredSelector({
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const mockData = {
  item: [
    {symbol: 'ETH', currency: 'BTC', market: 'BINANCE'},
    {symbol: 'BTC', currency: 'USDT', market: 'BINANCE'},
    {symbol: 'EOS', currency: 'USDT', market: 'BINANCE'},
    {symbol: 'DASH', currency: 'ETH', market: 'BINANCE'},
  ],
};

const HomePageContainer = (props) => {
  const { username, loading, error } = useSelector(stateSelector);

  const dispatch = useDispatch();

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  const reposListProps = {
    loading: loading,
    error: error,
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
      <HomePage {...props} currecnyData={mockData}/>
    </>
  );
};

export default HomePageContainer;
