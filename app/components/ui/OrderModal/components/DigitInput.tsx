import * as React from 'react';
import styles from '../OrderModal.scss';
import _ from 'lodash';

const floatRegex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/g;

const filter = (value, regex) => {
  const newValue = value && value.split(' ').join('');
  if (newValue && newValue.match(regex) !== null) {
    return _.toNumber(newValue).toFixed(5);
  } else {
    return (0).toFixed(5);
  }
};

export const DigitInput: React.FC<any> = props => {
  const { value, setValue, delta = 0.01, disabled, autoFocus } = props;

  const decrement = () => {
    setValue((Number(value) - delta).toFixed(5));
  };
  const increment = () => {
    setValue((Number(value) + delta).toFixed(5));
  };
  const onCommit = () => {
    setValue(filter(value, floatRegex));
  };

  return (
    <div className={styles.input}>
      {disabled ? null : (
        <div className={styles.squareButton} onClick={decrement}>-</div>
      )}
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={onCommit}
        autoFocus={autoFocus}
        disabled={disabled}
      />
      {disabled ? null : (
        <div className={styles.squareButton} onClick={increment}>+</div>
      )}
    </div>
  );
};

export default DigitInput;
