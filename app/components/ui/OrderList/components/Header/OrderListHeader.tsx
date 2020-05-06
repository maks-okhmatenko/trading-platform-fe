import * as React from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';

import styles from './OrderListHeader.scss';


// PropsType
export type PropsType = {
  tabList: string[],
  currentTab: string,
  onTabChange: (tab: string) => void,
};

// Component
export const OrderListHeader: React.FC<PropsType> = (props) => {
  const { currentTab, onTabChange, tabList = [] } = props;

  // Declaration
  const dispatch = useDispatch();

  // Render
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerRow}>
          <ul className={styles.tabContainer}>
            {tabList.map((tab, idx) => {
              const classes = classnames(
                styles.tab, {
                  [styles.active]: tab === currentTab,
                });

              return (
                <li className={classes}
                  onClick={() => { onTabChange(tab); }}
                  key={idx}
                >
                  <span>{tab}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default OrderListHeader;
