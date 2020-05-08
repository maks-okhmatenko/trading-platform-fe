import * as React from 'react';
import styles from '../OrderModal.scss';
import CheckBox from '../../CheckBox';
import DigitInput from './DigitInput';

export const SwitchableInput: React.FC<any> = props => {
  const { title, onChange, value } = props;
  const [visible, setVisible] = React.useState(false);
  return (
    <div className={styles.digitInput}>
      <label className={styles.switcherLable}>
        <h1>{title}</h1>
        <CheckBox
          defaultValue={visible}
          onChange={checked => setVisible(checked)}
        />
      </label>
      {!visible ? null : (
        <DigitInput value={value} setValue={onChange} autoFocus />
      )}
    </div>
  );
};

export default SwitchableInput;
