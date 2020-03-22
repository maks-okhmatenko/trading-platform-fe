import * as React from 'react';

import styles from './Header.scss';

const Header = (props) => {

  return (
    <header className={styles.header}>

      <div className={styles.headerContainer}>
        <div className={styles.logo} />
        <div className={styles.avatar}>M</div>
      </div>

    </header>
  );
};

export default Header;
