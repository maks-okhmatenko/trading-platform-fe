import * as React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import styles from './CurrencyItems.scss';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useDispatch } from 'react-redux';
import { changeActiveSymbolChart } from '../../../../../containers/App/actions';
import { changeFavoriteSymbolList } from './../../../../../containers/App/actions';
import { CHANGE_TYPE } from 'containers/App/constants';

export type CurrencyItemsProps = {
  list: Array<{
    Bid: string;
    Ask: string;
    Direction: string;
    Spread: string;
    Digits: string;
    Time?: number;
  }>;
};

const TICKER_CTX_MENU = 'TICKER_CTX_MENU';

const CurrencyItems: React.FunctionComponent<CurrencyItemsProps> = ({
  list,
}) => {
  const dispatch = useDispatch();
  const handleNewOrderClick = e => {
    console.log(e);
  };

  const handleOpenChartClick = (e, data) => {
    dispatch(changeActiveSymbolChart(data.symbol));
  };

  const handleDeletePair = (e, data) => {
    dispatch(changeFavoriteSymbolList(CHANGE_TYPE.DELETE, data.symbol));
  };

  return (
    <div className={styles.currencyItemsWrap}>
      <ul className={styles.currencyList}>
        {Object.keys(list).map((item, index) => {
          const ticker = list[item];
          const direction = ticker.Direction;

          const classNames = classnames(styles.currencyItem, {
            [styles.up]: direction === '1',
            [styles.down]: direction === '0',
          });
          const time = moment.unix(ticker.Time / 1000).format('HH:mm:ss');
          return (
            <ContextMenuTrigger id={`${TICKER_CTX_MENU}-${item}`} key={item}>
              <li className={classNames}>
                <div
                  className={styles.currencySymbol}
                  onDoubleClick={e => {
                    handleOpenChartClick(e, { symbol: item });
                  }}
                >
                  {item.toUpperCase()}
                </div>
                <div className={styles.bidMarket}>
                  {Number.parseFloat(ticker.Bid).toFixed(5)}
                </div>
                <div className={styles.askMarket}>
                  {Number.parseFloat(ticker.Ask).toFixed(5)}
                </div>
                <div className={styles.spread}>{ticker.Spread}</div>
                <div className={styles.time}>{time}</div>
              </li>

              <ContextMenu id={`${TICKER_CTX_MENU}-${item}`}>
                <MenuItem data={{ symbol: item }} onClick={handleNewOrderClick}>
                  New order
                </MenuItem>
                <MenuItem
                  data={{ symbol: item }}
                  onClick={handleOpenChartClick}
                >
                  Open chart
                </MenuItem>
                <MenuItem data={{ symbol: item }} onClick={handleDeletePair}>
                  Delete pair
                </MenuItem>
              </ContextMenu>
            </ContextMenuTrigger>
          );
        })}
      </ul>
    </div>
  );
};

export default CurrencyItems;
