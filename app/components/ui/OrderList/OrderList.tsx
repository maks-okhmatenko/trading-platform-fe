import * as React from 'react';
import { connect } from 'react-redux';
import {
  OrderListHeader,
  PropsType as HeaderProps,
} from './components/Header/OrderListHeader';
import {
  OrderListItems,
  PropsType as ItemsProps,
} from './components/Items/OrderListItems';
import { createStructuredSelector } from 'reselect';
import { closeOrder, loadOpenOrders, loadHistoryOrders, setOrdersDateFilder } from 'containers/App/actions';
import {
  makeSelectOrdersLoading,
  makeSelectOpenOrders,
  makeSelectHistoryOrders,
  makeSelectTickers,
} from 'containers/App/selectors';
const { useState } = React;

import styles from './OrderList.scss';

const tabList = ['Open orders', 'History'];

const openOrdersPropList = [
  { label: 'Deal',      name: 'Order',        sortable: true , type: 'w5' },
  { label: 'Login',     name: 'Login',        sortable: true , type: 'w7' },
  { label: 'Time',      name: 'OpenTime',     sortable: true , type: 'w5' },
  { label: 'Type',      name: 'Cmd',          sortable: true , type: 'w3' },
  { label: 'Symbol',    name: 'Symbol',       sortable: true , type: 'w5' },
  { label: 'Volume',    name: 'Volume',       sortable: true , type: 'w3' },
  { label: 'Price',     name: 'OpenPrice',    sortable: true , type: 'w3' },
  { label: 'S / L',     name: 'Sl',           sortable: true , type: 'w7' },
  { label: 'T / P',     name: 'Tp',           sortable: true , type: 'w7' },
  { label: 'Price',     name: 'ClosePrice',   sortable: true , type: 'w3', online: true },
  { label: 'Reason',    name: 'Reason',       sortable: true , type: 'w5' },
  { label: 'Commision', name: 'Commision',    sortable: true , type: 'w5' },
  { label: 'Swap',      name: 'Swap',         sortable: true , type: 'w3' },
  { label: 'USD',       name: 'Profit',       sortable: true , type: 'w3', online: true },
  { label: 'Comment',   name: 'Comment',      sortable: true , type: 'w9' },
  { label: '',          name: 'delete',       sortable: false, type: ''   },
];

const historyOrdersPropList = [
  { label: 'Deal',      name: 'Order',        sortable: true , type: 'w5' },
  { label: 'Login',     name: 'Login',        sortable: true , type: 'w7' },
  { label: 'Time',      name: 'OpenTime',     sortable: true , type: 'w5' },
  { label: 'Type',      name: 'Cmd',          sortable: true , type: 'w3' },
  { label: 'Symbol',    name: 'Symbol',       sortable: true , type: 'w5' },
  { label: 'Volume',    name: 'Volume',       sortable: true , type: 'w3' },
  { label: 'Price',     name: 'OpenPrice',    sortable: true , type: 'w3' },
  { label: 'S / L',     name: 'Sl',           sortable: true , type: 'w7' },
  { label: 'T / P',     name: 'Tp',           sortable: true , type: 'w7' },
  { label: 'Time',      name: 'CloseTime',    sortable: true , type: 'w5' },
  { label: 'Price',     name: 'ClosePrice',   sortable: true , type: 'w3' },
  { label: 'Reason',    name: 'Reason',       sortable: true , type: 'w5' },
  { label: 'Commision', name: 'Commision',    sortable: true , type: 'w5' },
  { label: 'Swap',      name: 'Swap',         sortable: true , type: 'w3' },
  { label: 'USD',       name: 'Profit',       sortable: true , type: 'w3' },
  { label: 'Comment',   name: 'Comment',      sortable: true , type: 'w9' },
  { label: '',          name: 'delete',       sortable: false, type: ''   },
];

// Component
const OrderList: React.FC<any> = props => {
  const {
    loading,
    openOrders,
    historyOrders,
    closeOrder,
    loadOpenOrders,
    loadHistoryOrders,
    setOrdersDateFilder,
    tickers,
  } = props;

  // Declaration
  // - state
  const [currentTab, onTabChange] = useState(tabList[0]);
  const items = currentTab === tabList[0] ?  openOrders : historyOrders;
  const propList = currentTab === tabList[0] ? openOrdersPropList : historyOrdersPropList;

  // - handlers
  const handleOrderDelete = (id) => {
    const ordertoDelete = items.find(order => order.id === id);
    if (ordertoDelete) { closeOrder(ordertoDelete); }
  };

  // - hoocks
  React.useEffect(() => {
    loadOpenOrders();
    loadHistoryOrders();
  }, []);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentTab === tabList[0]) {
        loadOpenOrders();
      } else {
        loadHistoryOrders();
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [currentTab]);

  // - props
  const headerProps: HeaderProps = {
    tabList,
    currentTab,
    onTabChange,
    setOrdersDateFilder,
  };

  const itemsProps: ItemsProps = {
    tickers,
    orderList: items,
    loading,
    propList,
    onOrderDelete: handleOrderDelete,
    onOrderUpdate: (props) => console.log(props),
    onSort: (sotrBy, direction) => console.log('sortBy' + sotrBy + ' dir:' + direction),
  };

  // Render
  return (
    <div className={styles.mainContainer}>
      <OrderListHeader {...headerProps} />

      {!items ? (
        <span>Loading...</span>
      ) : (
        <OrderListItems {...itemsProps} />
      )}
    </div>
  );
};


const mapStateToProps = createStructuredSelector({
  openOrders: makeSelectOpenOrders(),
  historyOrders: makeSelectHistoryOrders(),
  loading: makeSelectOrdersLoading(),
  tickers: makeSelectTickers(),
});

const mapDispatchToProps = {
  closeOrder,
  loadOpenOrders,
  loadHistoryOrders,
  setOrdersDateFilder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderList);
