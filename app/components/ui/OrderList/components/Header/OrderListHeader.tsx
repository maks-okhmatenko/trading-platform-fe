import * as React from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';

import styles from './OrderListHeader.scss';
import DropDown from 'components/ui/DropDown/DropDown';

const timeFilter = [
  { id: 0, value: 'All history' },
  { id: 1, value: 'Today' },
  { id: 2, value: 'Last 3 days' },
  { id: 3, value: 'Last week' },
  { id: 4, value: 'Last month' },
  { id: 5, value: 'Last 3 month' },
  { id: 6, value: 'Last 6 month' },
];

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
  const [period, setPeriod] = React.useState(timeFilter[0]);
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
          <DropDown
            className={styles.dropdown}
            defValue={period.value}
            items={timeFilter}
            onChange={setPeriod}/>
        </div>
      </div>
    </>
  );
};

export default OrderListHeader;
