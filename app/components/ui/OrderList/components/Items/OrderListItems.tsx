import * as React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';
import { ORDER_ITEM_TYPE, SIDE_TYPE } from 'containers/App/constants';

import styles from './OrderListItems.scss';

const { Component } = React;

const propList = [
  { label: 'Id',            name: 'id'           },
  { label: 'Open Time',     name: 'date'         },
  { label: 'Symbol',        name: 'symbol'       },
  { label: 'Volume',        name: 'volume'       },
  { label: 'Side',          name: 'side'         },
  { label: 'Open Price',    name: 'openPrice'    },
  { label: 'Current Price', name: 'currentPrice' },
  { label: 'Stop Loss',     name: 'stopLoss'     },
  { label: 'Take Profit',   name: 'takeProfit'   },
  { label: 'Swap',          name: 'swap'         },
];

// PropsType
export type PropsType = {
  orderList: ORDER_ITEM_TYPE[],
};

// StateType
export type StateType = {
  sortBy: string,
  sortDir: boolean,
};

// Component
export class OrderListItems extends Component<PropsType, StateType> {

  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      sortBy: '',
      sortDir: true,
    };
  }

  // Handlers
  public handleSort(propName) {
    const { sortBy, sortDir } = this.state;
    if (sortBy === propName) {
      this.setState({sortDir: !sortDir});
    } else {
      this.setState({sortDir: false, sortBy: propName});
    }
  }

  // Render
  public render() {
    const { orderList } = this.props;
    const { sortBy, sortDir } = this.state;

    return (
      <div className={styles.mainContainer}>
        <table className={styles.tableContainer}>
          <thead className={styles.header}>
            <tr>
              {propList.map(item => {
                const classes = item.name === sortBy
                  ? sortDir
                    ? styles.sortByUp
                    : styles.sortByDown
                  : classnames(styles.sortByUp, styles.sortByDown);

                return (
                  <th className={classes}
                    onClick={() => { this.handleSort(item.name); }}
                    key={item.name}
                  >
                    {item.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={styles.body}>
            {orderList.map(order => (
              <tr key={order.id}>
                {propList.map(prop => {
                  const value = order[prop.name];

                  if (prop.name === 'date') {
                    return (
                      <td>
                        {moment(value).format('DD.MM.YYYY')}
                        <span> {moment(value).format('hh:mm:ss')}</span>
                      </td>
                    );
                  }

                  if (prop.name === 'side') {
                    return (
                      <td className={styles[value === SIDE_TYPE.BUY ? 'green' : 'red']}>
                        {value}
                      </td>
                    );
                  }

                  return (
                    <td key={prop.name}>{value}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OrderListItems;
