import * as React from 'react';
import FavoriteIcon from 'components/ui/icons/FavoriteIcon';
import styles from './DropDown.scss';
import classnames from 'classnames';

export const DropDown = (props) => {
  const {
    items = [],
    placeholder,
    defValue,
    onFilter,
    onChange,
    showPlusBtn = false,
    closeOnPick = true,
    className,
  } = props;

  const [filter, setFilter] = React.useState('');
  const [isShow, show] = React.useState(false);

  const handleFilter = (e) => {
    if (onFilter) {
      setFilter(onFilter(e.target.value));
    }
  };

  const handlePick = (value) => (e) => {
    onChange(value);
    show(!closeOnPick);
  };

  const handleShow = (visible = true) => (e) => {
    show(visible);
  };

  return (
    <div className={classnames(styles.searchContainer, {[styles.active] : isShow})}>
      {!isShow ? null : <div className={styles.grid} onClick={handleShow(false)}/>}
      {!defValue ? (
        <input type="input" placeholder={placeholder}
          onClick={handleShow()}
          className={styles.searchInput}
          onChange={handleFilter}
        />
      ) : (
        <div className={classnames(className, styles.searchInput)} onClick={handleShow()}>{defValue}</div>
      )}
      {!showPlusBtn ? null : (
        <div className={styles.addButton} onClick={handleShow()}>
          <div>+</div>
        </div>
      )}
      {!isShow ? null :
        <>
          <ul className={styles.addList}>
            {items.filter(item => item.value.includes(filter))
              .map(item => {
              const {value, favorite, id} = item;
              return (
                <li key={id} onClick={handlePick(item)}>
                  {favorite === undefined ? null : <FavoriteIcon active={favorite}/>}
                  <span>{value}</span>
                </li>
              );
            })}
          </ul>
        </>
      }
    </div>
  );
};

export default DropDown;
