import * as React from 'react';
import styles from '../OrderModal.scss';
import _toNumber from 'lodash/toNumber';

const floatRegex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/g;

const filter = (value) => {
  const newValue = value && value.split(' ').join('');
  if (newValue && newValue.match(floatRegex) !== null) {
    return _toNumber(newValue);
  } else {
    return 0;
  }
};

export const DigitInput: React.FC<any> = props => {
  const { value, setValue, delta = 0.01, disabled, autoFocus, fixed = 5 } = props;

  const decrement = () => {
    setValue((Number(value) - delta).toFixed(fixed));
  };
  const increment = () => {
    setValue((Number(value) + delta).toFixed(fixed));
  };
  const onCommit = () => {
    setValue(filter(value).toFixed(fixed));
  };
  const onChange = (e) => {
    const newValue = e.target.value;
    if (newValue && newValue.match(floatRegex) !== null) {
      setValue(newValue);
    }
  };

  return (
    <div className={styles.input}>
      {disabled ? null : (
        <div className={styles.squareButton} onClick={decrement}>-</div>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
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
