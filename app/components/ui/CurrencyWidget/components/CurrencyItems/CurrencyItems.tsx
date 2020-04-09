import * as React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import styles from './CurrencyItems.scss';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useDispatch } from 'react-redux';
import { changeActiveSymbolChart } from '../../../../../containers/App/actions';
import { changeFavoriteSymbolList } from './../../../../../containers/App/actions';
import { CHANGE_TYPE } from 'containers/App/constants';
import FavoriteIcon from 'components/ui/icons/FavoriteIcon';

export type CurrencyItemsProps = {
  list: Array<{
    Bid: string;
    Ask: string;
    Direction: string;
    Spread: string;
    Digits: string;
    Time?: number;
  }>;
  favoriteTickers: [];
  filter: string;
};

const TICKER_CTX_MENU = 'TICKER_CTX_MENU';

const CurrencyItems: React.FunctionComponent<CurrencyItemsProps> = ({
  list,
  favoriteTickers,
  filter,
}) => {
  const dispatch = useDispatch();
  const handleNewOrderClick = e => {
    console.log(e);
  };

  const handleOpenChartClick = (e, data) => {
    dispatch(changeActiveSymbolChart(CHANGE_TYPE.ADD, data.symbol));
  };

  const handleSwitchIsFavorite = (isFavorite, symbol) => {
    dispatch(changeFavoriteSymbolList(
      isFavorite ? CHANGE_TYPE.DELETE : CHANGE_TYPE.ADD,
      symbol,
      ),
    );
  };

  return (
    <div className={styles.currencyItemsWrap}>
      <ul className={styles.currencyList}>
        {Object.keys(list).filter(item => item.includes(filter)).map((symbol, index) => {
          const ticker = list[symbol];
          const direction = ticker.Direction;
          const isFavorite = !!favoriteTickers.find(item => item === symbol);

          const classNames = classnames(styles.currencyItem, {
            [styles.up]: direction === '1',
            [styles.down]: direction === '0',
          });
          const time = moment.unix(ticker.Time / 1000).format('HH:mm:ss');
          return (
            <ContextMenuTrigger id={`${TICKER_CTX_MENU}-${symbol}`} key={symbol}>
              <li className={classNames}>
                <FavoriteIcon active={isFavorite} onClick={(e) => handleSwitchIsFavorite(isFavorite, symbol)}/>
                <div
                  className={styles.currencySymbol}
                  onDoubleClick={e => {
                    handleOpenChartClick(e, { symbol });
                  }}
                >
                  {symbol.toUpperCase()}
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

              <ContextMenu id={`${TICKER_CTX_MENU}-${symbol}`}>
                <MenuItem data={{ symbol }} onClick={handleNewOrderClick}>
                  New order
                </MenuItem>
                <MenuItem
                  data={{ symbol }}
                  onClick={handleOpenChartClick}
                >
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
