import * as React from 'react';
import moment from 'moment';
import {
  OrderListHeader,
  PropsType as HeaderProps,
} from './components/Header/OrderListHeader';
import {
  OrderListItems,
  PropsType as ItemsProps,
} from './components/Items/OrderListItems';

import styles from './OrderList.scss';
import { ORDER_ITEM_TYPE, SIDE_TYPE } from 'containers/App/constants';

const { useState } = React;

const testOrderList: ORDER_ITEM_TYPE[] = [
  {
    id: 'asASdaasdassdasd-sadd11',
    date: moment.now(),
    symbol: 'ASDASD',
    volume: '0.012',
    side: SIDE_TYPE.BUY,
    openPrice: '0.123',
    currentPrice: '0.213',
    stopLoss: '0.333',
    takeProfit: '0.21',
    swap: '0.00',
    commission: '0.00',
    netProfit: '-0.001',
  },
  {
    id: '111',
    date: moment.now(),
    symbol: 'ASDASD',
    volume: '0.012',
    side: SIDE_TYPE.SELL,
    openPrice: '0.123',
    currentPrice: '0.213',
    stopLoss: '0.333',
    takeProfit: '0.21',
    swap: '0.00',
    commission: '0.00',
    netProfit: '-0.001',
  },
  {
    id: '111',
    date: moment.now(),
    symbol: 'ASDASD',
    volume: '0.012',
    side: SIDE_TYPE.BUY,
    openPrice: '0.123',
    currentPrice: '0.213',
    stopLoss: '0.333',
    takeProfit: '0.21',
    swap: '0.00',
    commission: '0.00',
    netProfit: '-0.001',
  },
  {
    id: '111',
    date: moment.now(),
    symbol: 'ASDASD',
    volume: '0.012',
    side: SIDE_TYPE.BUY,
    openPrice: '0.123',
    currentPrice: '0.213',
    stopLoss: '0.333',
    takeProfit: '0.21',
    swap: '0.00',
    commission: '0.00',
    netProfit: '-0.001',
  },
];

const tabList = ['Orders', 'History'];

// PropsType
export type PropsType = {
  loading: boolean;
  itemList: [];
};

// Component
export const OrderList: React.FC<PropsType> = props => {
  const { loading, itemList } = props;

  // Declaration
  // - state
  const [currentTab, onTabChange] = useState(tabList[0]);

  // - props
  const headerProps: HeaderProps = {
    tabList,
    currentTab,
    onTabChange,
  };

  const itemsProps: ItemsProps = {
    orderList: testOrderList,
  };

  // Render
  return (
    <div className={styles.container}>
      <OrderListHeader {...headerProps} />

      {loading ? (
        <span>Loading...</span>
      ) : itemList && !loading ? (
        <OrderListItems {...itemsProps} />
      ) : null}
    </div>
  );
};

export default OrderList;
