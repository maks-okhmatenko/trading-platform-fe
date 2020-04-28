import * as React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';
import { ORDER, SIDE_TYPE } from 'containers/App/constants';
import _ from 'lodash';

import styles from './OrderListItems.scss';

const { Component } = React;

const propList = [
  { label: 'Id',            name: 'id',           sortable: true  },
  { label: 'Open Time',     name: 'OpenTime',     sortable: true  },
  { label: 'Symbol',        name: 'Symbol',       sortable: true  },
  { label: 'Volume',        name: 'Volume',       sortable: true  },
  { label: 'Side',          name: 'Cmd',          sortable: true  },
  { label: 'Open Price',    name: 'Price',        sortable: true  },
  { label: 'Current Price', name: 'CurrentPrice', sortable: true  },
  { label: 'Stop Loss',     name: 'Sl',           sortable: true  },
  { label: 'Take Profit',   name: 'Tp',           sortable: true  },
  { label: 'Swap',          name: 'swap',         sortable: true  },
  { label: 'Commission',    name: 'commission',   sortable: true  },
  { label: 'Net profit',    name: 'netProfit',    sortable: true  },
  { label: '',              name: 'delete',       sortable: false },
];

// PropsType
export type PropsType = {
  orderList: ORDER[],
  loading: boolean,
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
    const { orderList, onOrderDelete, onOrderUpdate, loading } = this.props;
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
                    onClick={item.sortable ? () => this.handleSort(item.name) : undefined}
                    key={item.name}
                  >
                    {item.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={styles.body}>
            {loading ? <div className={styles.loading}/> : null}
            {orderList.map(order => {
              return (
              <tr key={order.id}>
                {propList.map(prop => {
                  const value = order[prop.name];

                  if (prop.name === 'OpenTime') {
                    const openMoment = moment.unix(value);
                    return (
                      <td key={prop.name}>
                        {!value ? null : <>
                          {openMoment.format('DD.MM.YYYY')}
                          <span> {openMoment.format('hh:mm:ss')}</span>
                        </>}
                      </td>
                    );
                  }

                  if (prop.name === 'Cmd') {
                    const color = value === SIDE_TYPE.BUY ? 'green' : 'red';
                    return (
                      <td key={prop.name} className={styles[color]}>
                        {value}
                      </td>
                    );
                  }

                  if (prop.name === 'netProfit') {
                    const color = _.toNumber(value) > 0 ? 'green' : 'red';
                    return (
                      <td key={prop.name} className={styles[color]}>
                        {value}
                      </td>
                    );
                  }

                  if (prop.name === 'Sl' || prop.name === 'Tp') {
                    return (
                      <td key={prop.name}>
                        <div className={styles.inline}>
                          {Number(value || 0).toFixed(5)}
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
                          onClick={() => order.id && onOrderDelete(order.id)}
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
