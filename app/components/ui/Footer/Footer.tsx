import * as React from 'react';

import styles from './Footer.scss';
import CheckBox from './../CheckBox';

const Footer = (props) => {
  const { onThemeChange, theme } = props;

  return (
    <footer className={styles.footer}>
      <label className={styles.themeController}>
        <CheckBox onChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}/>
      </label>
    </footer>
  );
};

export default Footer;
