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
import ArrowIcon from 'components/ui/icons/Arrow_icon';

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

const CurrencyItems: React.FunctionComponent<CurrencyItemsProps> = (props) => {
  const {
    list,
  } = props;
  const dispatch = useDispatch();
  const handleNewOrderClick = e => {
    console.log(e);
  };

  const handleOpenChartClick = (e, data) => {
    dispatch(changeActiveSymbolChart(CHANGE_TYPE.ADD, data.symbol));
  };

  const handleSwitchIsFavorite = (symbol) => {
    dispatch(
      changeFavoriteSymbolList(CHANGE_TYPE.DELETE, symbol),
    );
  };

  return (
    <div className={styles.currencyItemsWrap}>
      <table className={styles.currencyList}>
        <thead className={styles.currencyItem}>
          <tr>
            <th><ArrowIcon /></th>
            <th>Symbol</th>
            <th>Bid</th>
            <th>Ask</th>
            <th>!</th>
            <th>Time</th>
            <th><FavoriteIcon active/></th>
          </tr>
        </thead>
        <tbody>
        {Object.keys(list).map((symbol) => {
          const ticker = list[symbol];
          const direction = ticker.Direction === '1';

          const classNames = classnames(styles.currencyItem, {
            [styles.up]: direction,
            [styles.down]: !direction,
          });
          const time = moment.unix(ticker.Time / 1000).format('HH:mm:ss');
          return (
            <ContextMenuTrigger
              attributes={{className: classNames}}
              renderTag={'tr'}
              id={`${TICKER_CTX_MENU}-${symbol}`}
              key={symbol}
            >
              <td>
                <ArrowIcon direction={direction}/>
              </td>
              <td className={styles.symbol} onDoubleClick={e => handleOpenChartClick(e, { symbol })}>
                {symbol.toUpperCase()}
              </td>
              <td className={styles.colorize}>
                {Number.parseFloat(ticker.Bid).toFixed(5)}
              </td>
              <td className={styles.colorize}>
                {Number.parseFloat(ticker.Ask).toFixed(5)}
              </td>
              <td className={styles.colorize}>{ticker.Spread}</td>
              <td>{time}</td>
              <td>
                <FavoriteIcon active onClick={(e) => handleSwitchIsFavorite(symbol)}/>
              </td>
              <ContextMenu id={`${TICKER_CTX_MENU}-${symbol}`}>
                <MenuItem data={{ symbol }} onClick={handleNewOrderClick}>
                  New order
                </MenuItem>
                <MenuItem data={{ symbol }} onClick={handleOpenChartClick}>
                  Open chart
                </MenuItem>
              </ContextMenu>
            </ContextMenuTrigger>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

export default CurrencyItems;
