import * as React from 'react';
import { useDispatch } from 'react-redux';
import styles from './CurrencyWidgetHeader.scss';
import moment from 'moment';
import FavoriteIcon from 'components/ui/icons/FavoriteIcon';
import { changeFavoriteSymbolList } from 'containers/App/actions';
import { CHANGE_TYPE } from 'containers/App/constants';
import _difference from 'lodash/difference';

const CurrencyWidgetHeader = (props) => {
  const { symbolList = [], favoriteTickers } = props;
  const [filter, setFilter] = React.useState('');
  const [time, setTime] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.unix(moment.now() / 1000).format('HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const dispatch = useDispatch();
  const handleSwitchIsFavorite = (isFavorite, symbol) => {
    dispatch(
      changeFavoriteSymbolList(
        isFavorite ? CHANGE_TYPE.DELETE : CHANGE_TYPE.ADD,
        symbol,
      ),
    );
  };

  const handlePickAll = (active) => {
    const newFavoriteList = !active ? symbolList : [];
    dispatch(
      changeFavoriteSymbolList(
        CHANGE_TYPE.INIT,
        newFavoriteList,
      ),
    );
  };

  const allSymbolsIsFavorite = _difference(symbolList, favoriteTickers).length === 0;

  return (
    <>
      <div className={styles.currencyWidgetHeader}>
        <div className={styles.mainSectionWrap}>
          <span className={styles.widgetHeader}>WATCHLIST</span>
          <span className={styles.widgetHeaderTime}>{time}</span>
          <div className={styles.searchContainer} tabIndex={0}>
            <input type="input" placeholder="Search..."
              className={styles.searchInput}
              onChange={(e) => setFilter(e.target.value.toUpperCase())}
            />
            <div className={styles.addButton}>
              <div>+</div>
            </div>
            <ul className={styles.addList}>
              <li key={1} onClick={() => { handlePickAll(allSymbolsIsFavorite); }}>
                <FavoriteIcon active={allSymbolsIsFavorite}/>
                <span>ALL</span>
              </li>
              {symbolList.filter(item => item.includes(filter)).map(symbol => {
                const active = favoriteTickers.find(item => item === symbol);

                return (
                  <li key={symbol} onClick={(e) => handleSwitchIsFavorite(active, symbol)}>
                    <FavoriteIcon active={active}/>
                    <span>{symbol}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrencyWidgetHeader;
