import * as React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useDispatch } from 'react-redux';
import { changeActiveSymbolChart, openNewOrder, changeFavoriteSymbolList } from 'containers/App/actions';
import { CHANGE_TYPE } from 'containers/App/constants';
import FavoriteIcon from 'components/ui/icons/FavoriteIcon';
import ArrowIcon from 'components/ui/icons/Arrow_icon';
import OrderModal from 'components/ui/OrderModal/OrderModal';
import styles from './CurrencyItems.scss';

const { useState } = React;


export type CurrencyItemsProps = {
  favoriteTickers: string[],
  login: string,
  isOrderLoading: boolean,
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

const CurrencyItems: React.FC<CurrencyItemsProps> = (props) => {
  const { list, favoriteTickers, login, isOrderLoading } = props;

  const dispatch = useDispatch();
  const [modalSymbol, setModalSymbol] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  // Handlers
  const handleNewOrderClick = (symbol) => () => {
    setModalSymbol(symbol);
    setModalVisible(true);
  };

  const handleOpenChartClick = (symbol) =>
    () => dispatch(changeActiveSymbolChart(CHANGE_TYPE.ADD, symbol));

  const handleSwitchIsFavorite = (symbol) =>
    () => dispatch(
      changeFavoriteSymbolList(CHANGE_TYPE.DELETE, symbol),
    );

  const handleModalSubmit = (newOrder) => {
    dispatch(openNewOrder(newOrder));
  };

  // Hooks
  React.useEffect(() => {
    setModalVisible(isOrderLoading);
  }, [isOrderLoading]);

  // ModalProps
  const currTicker = list[modalSymbol];
  const liveModalProps = currTicker ? {
    symbol: modalSymbol,
    ask: currTicker.Ask,
    bid: currTicker.Bid,
    login,
    isOrderLoading,
  } : {};
  const modalProps = {
    isVisible: isModalVisible || isOrderLoading,
    handleClose: () => setModalVisible(false),
    onSubmit: handleModalSubmit,
    ...liveModalProps,
  };

  // Render
  return (
    <div className={styles.currencyItemsWrap}>
      <OrderModal {...modalProps} />
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
        {favoriteTickers.map((symbol) => {
          const ticker = list[symbol];
          if (!ticker) {
            return null;
          }
          const direction = ticker.Direction === '1';

          const classNames = classnames(styles.currencyItem, {
            [styles.up]: direction,
            [styles.down]: !direction,
          });
          const time = moment.unix(ticker.Time / 1000).format('HH:mm:ss');
          const bid = Number.parseFloat(ticker.Bid);
          const ask = Number.parseFloat(ticker.Ask);
          const spread = ask - bid;
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
              <td className={styles.symbol} onDoubleClick={handleOpenChartClick(symbol)}>
                {symbol.toUpperCase()}
              </td>
              <td className={styles.colorize}>
                {bid.toFixed(5)}
              </td>
              <td className={styles.colorize}>
                {ask.toFixed(5)}
              </td>
              <td className={styles.colorize}>{spread.toFixed(5)}</td>
              <td>{time}</td>
              <td>
                <FavoriteIcon active onClick={handleSwitchIsFavorite(symbol)}/>
                <ContextMenu id={`${TICKER_CTX_MENU}-${symbol}`}>
                  <MenuItem onClick={handleNewOrderClick(symbol)}>
                    New order
                  </MenuItem>
                  <MenuItem onClick={handleOpenChartClick(symbol)}>
                    Open chart
                  </MenuItem>
                </ContextMenu>
              </td>
            </ContextMenuTrigger>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

export default CurrencyItems;
