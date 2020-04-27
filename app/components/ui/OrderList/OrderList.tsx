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
import { ORDER_ITEM_TYPE, SIDE_TYPE, ORDER } from 'containers/App/constants';

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
    id: '1fgjh11',
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
    id: '178911',
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
    id: '1911',
    date: moment.now(),
    symbol: 'ASDASD',
    volume: '0.012',
    side: SIDE_TYPE.BUY,
    openPrice: '0.123',
    currentPrice: '0.213',
    stopLoss: '',
    takeProfit: '0',
    swap: '0.00',
    commission: '0.00',
    netProfit: '0.001',
  },
];

const tabList = ['Orders', 'History'];

// PropsType
export type PropsType = {
  loading: boolean;
  itemList: ORDER[];
  onDelete: (order: ORDER) => void;
};

// Component
export const OrderList: React.FC<PropsType> = props => {
  const { loading, itemList, onDelete } = props;

  // Declaration
  // - state
  const [currentTab, onTabChange] = useState(tabList[0]);

  // - props
  const headerProps: HeaderProps = {
    tabList,
    currentTab,
    onTabChange,
  };

  // - handlers
  const handleOrderDelete = (id) => {
    const ordertoDelete = itemList.find(order => order.id === id);
    if (ordertoDelete) { onDelete(ordertoDelete); }
  };

  const itemsProps: ItemsProps = {
    orderList: itemList,
    loading,
    onOrderDelete: handleOrderDelete,
    onOrderUpdate: (props) => console.log(props),
    onSort: (sotrBy, direction) => console.log('sortBy' + sotrBy + ' dir:' + direction),
  };

  // Render
  return (
    <div className={styles.mainContainer}>
      <OrderListHeader {...headerProps} />

      {!itemList ? (
        <span>Loading...</span>
      ) : (
        <OrderListItems {...itemsProps} />
      )}
    </div>
  );
};

export default OrderList;
