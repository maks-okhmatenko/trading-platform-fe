import * as React from 'react';
import styles from './CurrencyWidgetHeader.scss';
import { useDispatch } from 'react-redux';
import FavoriteIcon from 'components/ui/icons/FavoriteIcon';
import { setAllTickersShow } from 'containers/App/actions';

const CurrencyWidgetHeader = (props) => {
  const { allTickersShow, onFilterSet } = props;
  const dispatch = useDispatch();
  const handleSwitchTickersView = () => dispatch(setAllTickersShow(!allTickersShow));

  return (
    <>
      <div className={styles.currencyWidgetHeader}>
        <div className={styles.mainSectionWrap}>
          <span className={styles.widgetHeader}>WATCHLIST</span>
          <input type="input" placeholder="Search..."
            className={styles.searchInput}
            onChange={(e) => onFilterSet(e.target.value.toUpperCase())}
          />
        </div>
      </div>
      <div className={styles.subSectionWrap}>
        <ul className={styles.tableTitle}>
          <FavoriteIcon active={!allTickersShow} onClick={handleSwitchTickersView}/>
          <li>Symbol</li>
          <li>Bid</li>
          <li>Aks</li>
          <li>!</li>
          <li>Time</li>
        </ul>
      </div>
    </>
  );
};

export default CurrencyWidgetHeader;
