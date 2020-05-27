import * as React from 'react';
import { useDispatch } from 'react-redux';
import styles from './CurrencyWidgetHeader.scss';
import moment from 'moment';
import { changeFavoriteSymbolList } from 'containers/App/actions';
import { CHANGE_TYPE } from 'containers/App/constants';
import _difference from 'lodash/difference';
import DropDown from 'components/ui/DropDown/DropDown';

const CurrencyWidgetHeader = (props) => {
  const { symbolList = [], favoriteTickers } = props;
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
  const handleSwitchIsFavorite = ({id, favorite}) => {
    if (id === 'ALL') {
      handlePickAll(favorite);
      return;
    }
    dispatch(
      changeFavoriteSymbolList(
        favorite ? CHANGE_TYPE.DELETE : CHANGE_TYPE.ADD,
        id,
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

  const symbolItems = [
    {
      id: 'ALL',
      value: 'ALL',
      favorite: _difference(symbolList, favoriteTickers).length === 0,
    },
    ...symbolList.map(symbol => ({
      id: symbol,
      value: symbol,
      favorite: favoriteTickers.find(item => item === symbol) || false,
    })),
  ];

  return (
    <>
      <div className={styles.currencyWidgetHeader}>
        <div className={styles.mainSectionWrap}>
          <span className={styles.widgetHeader}>WATCHLIST</span>
          <span className={styles.widgetHeaderTime}>{time}</span>
          <DropDown
            items={symbolItems}
            placeholder="Search..."
            onChange={handleSwitchIsFavorite}
            onFilter={filter => filter.toUpperCase()}
            showPlusBtn={true}
            closeOnPick={false}
          />
        </div>
      </div>
    </>
  );
};

export default CurrencyWidgetHeader;
