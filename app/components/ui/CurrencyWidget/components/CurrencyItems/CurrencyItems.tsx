import * as React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import styles from './CurrencyItems.scss';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useDispatch } from 'react-redux';
import { EVENT_NAME, FRAME_TYPES } from '../../../../../containers/App/constants';
import { socketIoSubscribeTimeframe } from '../../../../../containers/App/actions';

export type CurrencyItemsProps = {
  list: Array<{
    Bid: string;
    Ask: string;
    Direction: string;
    Spread: string;
    Digits: string;
  }>;
};

const TICKER_CTX_MENU = 'TICKER_CTX_MENU';

const CurrencyItems: React.FunctionComponent<CurrencyItemsProps> = ({ list }) => {
  const dispatch = useDispatch();
  const handleNewOrderClick = (e) => {
    console.log(e);
  };

  const handleOpenChartClick = (e, objData) => {
    console.log(objData.symbol);
    dispatch(socketIoSubscribeTimeframe(EVENT_NAME.SUBSCRIBE_TIME_FRAME, {
      symbol: objData.symbol,
      frameType: FRAME_TYPES.M1,
      from: moment().subtract(1, 'hour').unix(),
      to: moment().unix(),
    }));
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

          const nowTime = new Date();
          const time = `${ nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()}`;
          return (
            <ContextMenuTrigger id={`${TICKER_CTX_MENU}-${item}`} key={item}>
              <li className={classNames}>
                <div className={styles.currencySymbol}>{item.toUpperCase()}</div>
                <div className={styles.bidMarket}>{ticker.Bid}</div>
                <div className={styles.askMarket}>{ticker.Ask}</div>
                <div className={styles.spread}>{ticker.Spread}</div>
                <div className={styles.time}>{time}</div>
              </li>

              <ContextMenu id={`${TICKER_CTX_MENU}-${item}`}>
                <MenuItem data={{symbol: item}} onClick={handleNewOrderClick}>
                  New order
                </MenuItem>
                <MenuItem data={{symbol: item}} onClick={handleOpenChartClick}>
                  Open chart
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
