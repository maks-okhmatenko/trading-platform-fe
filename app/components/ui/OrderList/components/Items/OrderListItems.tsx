import * as React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { ORDER, ORDER_CMD_TYPE } from 'containers/App/constants';
import _toNumber from 'lodash/toNumber';

import styles from './OrderListItems.scss';

const { Component } = React;

// PropsType
export type PropsType = {
  tickers: any[],
  orderList: ORDER[],
  loading: boolean,
  propList: any[],
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
    const { orderList, onOrderDelete, onOrderUpdate, loading, propList, tickers } = this.props;
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
              const ticker = tickers[order.Symbol];
              const volume = order['Volume'] ? _toNumber(order['Volume']) : 0;
              const openPrice = order['OpenPrice'] ? _toNumber(order['OpenPrice']) : 0;
              const bid = ticker ? _toNumber(ticker.Bid) : 0;
              const ask = ticker ? _toNumber(ticker.Ask) : 0;
              const currPrice = bid;
              const netProfit = (currPrice - openPrice) * 100000 * volume;

              return (
              <tr key={order.id}>
                {propList.map(prop => {
                  const value = order[prop.name];

                  if (prop.name === 'OpenTime') {
                    const openMoment = moment.unix(Date.parse(value) / 1000);
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
                    const color = value === ORDER_CMD_TYPE.BUY ? 'green' : 'red';
                    const viewValue = value === ORDER_CMD_TYPE.BUY ? 'buy' : 'sell';
                    return (
                      <td key={prop.name} className={styles[color]}>
                        {viewValue}
                      </td>
                    );
                  }

                  if (prop.name === 'CurrentPrice') {
                    return (
                      <td key={prop.name}>
                        {currPrice.toFixed(5)}
                      </td>
                    );
                  }

                  if (prop.name === 'Profit') {
                    const color = _toNumber(value) > 0 ? 'green' : 'red';
                    return (
                      <td key={prop.name} className={styles[color]}>
                        {value}
                      </td>
                    );
                  }

                  if (prop.name === 'CurrentProfit') {
                    const color = _toNumber(netProfit) > 0 ? 'green' : 'red';
                    return (
                      <td key={prop.name} className={styles[color]}>
                        {netProfit.toFixed(5)}
                      </td>
                    );
                  }

                  if (prop.name === 'Sl' || prop.name === 'Tp') {
                    const numValue = Number(value || 0);
                    return (
                      <td key={prop.name}>
                        <div className={styles.inline}>
                          {numValue.toFixed(5)}
                          { !numValue ? (
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
