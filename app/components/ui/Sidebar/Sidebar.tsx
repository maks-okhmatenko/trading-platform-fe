import * as React from 'react';

import styles from './Sidebar.scss';
import { NavLink } from 'react-router-dom';

const Sidebar = (props) => {

  const list = [
    {name: 'item'},
    {name: 'item'},
    {name: 'item'},
    {name: 'item'},
  ];

  return (
    <nav className={styles.sidebarWrap}>
      <ul className={styles.sidebarList}>
        {
          list.map((item, idx) => {
            return (
              <li  key={idx}>
                <NavLink to={'#'} className={styles.sidebarItem}>
                  <div className={styles.icon}>IC</div>
                  <span>{item.name} {idx}</span>
                </NavLink>
              </li>
            );
          })
        }
      </ul>
    </nav>
  );
};

export default Sidebar;
