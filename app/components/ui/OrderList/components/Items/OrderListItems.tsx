import * as React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';
import { ORDER_ITEM_TYPE, SIDE_TYPE } from 'containers/App/constants';

import styles from './OrderListItems.scss';

const { Component } = React;

const propList = [
  { label: 'Id',            name: 'id',           sortable: true  },
  { label: 'Open Time',     name: 'date',         sortable: true  },
  { label: 'Symbol',        name: 'symbol',       sortable: true  },
  { label: 'Volume',        name: 'volume',       sortable: true  },
  { label: 'Side',          name: 'side',         sortable: true  },
  { label: 'Open Price',    name: 'openPrice',    sortable: true  },
  { label: 'Current Price', name: 'currentPrice', sortable: true  },
  { label: 'Stop Loss',     name: 'stopLoss',     sortable: true  },
  { label: 'Take Profit',   name: 'takeProfit',   sortable: true  },
  { label: 'Swap',          name: 'swap',         sortable: true  },
  { label: 'Commission',    name: 'commission',   sortable: true  },
  { label: 'Net profit',    name: 'netProfit',    sortable: true  },
  { label: '',              name: 'delete',       sortable: false },
];

// PropsType
export type PropsType = {
  orderList: ORDER_ITEM_TYPE[],
  onOrderDelete: (id: string) => void,
  onOrderUpdate: (props: any) => void,
  onSort: (colName: string, direction: boolean) => void,
};

// StateType
export type StateType = {
  sortBy: string,
  sortDir: boolean,
  onSort: (colName: string, direction: boolean) => void,
};

// Component
export class OrderListItems extends Component<PropsType, StateType> {

  // Constructor
  constructor(props) {
    super(props);
    const { onSort } = props;
    this.state = {
      sortBy: '',
      sortDir: true,
      onSort,
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
    this.state.onSort(sortBy, sortDir);
  }

  // Render
  public render() {
    const { orderList, onOrderDelete, onOrderUpdate } = this.props;
    const { sortBy, sortDir } = this.state;

    return (
      <div className={styles.mainContainer}>
        <table className={styles.tableContainer}>
          <thead className={styles.header}>
            <tr>
              {propList.map(item => {
                const classes = item.sortable
                  ? item.name === sortBy
                    ? sortDir
                      ? styles.sortByUp
                      : styles.sortByDown
                    : classnames(styles.sortByUp, styles.sortByDown)
                  : '';

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
            {orderList.map(order => {
              return (
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

                  if (prop.name === 'netProfit') {
                    return (
                      <td className={styles[Number(value) > 0 ? 'green' : 'red']}>
                        {value}
                      </td>
                    );
                  }

                  if (prop.name === 'stopLoss' || prop.name === 'takeProfit') {
                    return (
                      <td>
                        <div className={styles.inline}>
                          {Number(value || 0).toFixed(3)}
                          { !value ? (
                            <div className={styles.squareButton}
                              onClick={() => onOrderUpdate({id: order.id, [prop.name]: 1 })}
                            >+</div>
                          ) : (<></>)}
                        </div>
                      </td>
                    );
                  }

                  if (prop.name === 'delete') {
                    return (
                      <td key="deleteButton">
                        <div className={styles.squareButton}
                          onClick={() => onOrderDelete(order.id)}
                        >X</div>
                      </td>
                    );
                  }

                  return (
                    <td key={prop.name}>
                      {value}
                    </td>
                  );
                })}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default OrderListItems;
