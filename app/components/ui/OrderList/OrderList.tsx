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

import styles from './OrderList.scss';
import { createStructuredSelector } from 'reselect';
import { closeOrder, loadOpenOrders, loadHistoryOrders } from 'containers/App/actions';
import {
  makeSelectOrdersLoading,
  makeSelectOpenOrders,
  makeSelectHistoryOrders,
  makeSelectTickers,
} from 'containers/App/selectors';

const { useState } = React;

const tabList = ['Orders', 'History'];

const openOrdersPropList = [
  { label: 'Id',            name: 'Order',          sortable: true  },
  { label: 'Open Time',     name: 'OpenTime',       sortable: true  },
  { label: 'Symbol',        name: 'Symbol',         sortable: true  },
  { label: 'Volume',        name: 'Volume',         sortable: true  },
  { label: 'Side',          name: 'Cmd',            sortable: true  },
  { label: 'Open Price',    name: 'OpenPrice',      sortable: true  },
  { label: 'Current Price', name: 'CurrentPrice',   sortable: true  },
  { label: 'Stop Loss',     name: 'Sl',             sortable: true  },
  { label: 'Take Profit',   name: 'Tp',             sortable: true  },
  { label: 'Commission',    name: 'Commission',     sortable: true  },
  { label: 'Net profit',    name: 'CurrentProfit',  sortable: true  },
  { label: '',              name: 'delete',         sortable: false },
];

const historyOrdersPropList = [
  { label: 'Id',            name: 'Order',        sortable: true  },
  { label: 'Open Time',     name: 'OpenTime',     sortable: true  },
  { label: 'Symbol',        name: 'Symbol',       sortable: true  },
  { label: 'Volume',        name: 'Volume',       sortable: true  },
  { label: 'Side',          name: 'Cmd',          sortable: true  },
  { label: 'Open Price',    name: 'OpenPrice',    sortable: true  },
  { label: 'Close Price',   name: 'ClosePrice',   sortable: true  },
  { label: 'Stop Loss',     name: 'Sl',           sortable: true  },
  { label: 'Take Profit',   name: 'Tp',           sortable: true  },
  { label: 'Commission',    name: 'Commission',   sortable: true  },
  { label: 'Net profit',    name: 'Profit',       sortable: true  },
  { label: '',              name: 'delete',       sortable: false },
];

// Component
const OrderList: React.FC<any> = props => {
  const { loading, openOrders, historyOrders, closeOrder, loadOpenOrders, loadHistoryOrders, tickers } = props;

  // Declaration
  // - state
  const [currentTab, onTabChange] = useState(tabList[0]);
  const items = currentTab === tabList[0] ?  openOrders : historyOrders;
  const propList = currentTab === tabList[0] ? openOrdersPropList : historyOrdersPropList;

  // - props
  const headerProps: HeaderProps = {
    tabList,
    currentTab,
    onTabChange,
  };

  // - handlers
  const handleOrderDelete = (id) => {
    const ordertoDelete = items.find(order => order.id === id);
    if (ordertoDelete) { closeOrder(ordertoDelete); }
  };

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
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [currentTab]);

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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderList);
