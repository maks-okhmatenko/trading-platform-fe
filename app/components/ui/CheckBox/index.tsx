import React from 'react';
import styles from './CheckBox.scss';

const CheckBox: React.FC<any> = (props) => {
    const { onChange, defaultValue } = props;
    const [value, setValue] = React.useState(defaultValue);
    const handleOnChange = ({target: { checked }}) => {
        setValue(checked);
        onChange(checked);
    };

    return (
        <label className={styles.label}>
            <input type="checkbox"
                className={styles.checkbox}
                checked={value} onChange={handleOnChange}
            />
            <span className={styles.mark} />
        </label>
    );
};

export default CheckBox;
