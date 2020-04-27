import React from 'react';
import classnames from 'classnames';
import styles from './CheckBox.scss';

const CheckBox: React.FC<any> = (props) => {
  const { onChange, defaultValue, titleChecked, titleUnchecked } = props;
  const [value, setValue] = React.useState(defaultValue);
  const handleOnChange = ({target: { checked }}) => {
    setValue(checked);
    onChange(checked);
  };
  const isUncheckedGrey = !!titleUnchecked;

  const markClasses = classnames(styles.mark, {
      [styles.active] : isUncheckedGrey || value,
      [styles.inactive] : !isUncheckedGrey && !value,
      [styles.checked] : value,
    },
  );

  const labelClasses = classnames(styles.label, {
      [styles.active] : isUncheckedGrey && !value,
      [styles.inactive] : !isUncheckedGrey && !value,
    },
  );

  return (
    <label className={styles.wrapper}>
      {titleUnchecked}
      <label className={labelClasses}>
        <input type="checkbox"
          className={styles.checkbox}
          checked={value} onChange={handleOnChange}
        />
        <span className={markClasses} />
      </label>
      {titleChecked}
    </label>
  );
};

export default CheckBox;
