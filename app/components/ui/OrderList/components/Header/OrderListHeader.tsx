import * as React from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';

import styles from './OrderListHeader.scss';
import DropDown from 'components/ui/DropDown/DropDown';
import moment from 'moment';
import { TIME_IN_SECONDS } from 'containers/App/constants';
import _toNumber from 'lodash/toNumber';

const startOfAll = moment.unix(Date.parse('1970-01-01 00:00:00') / 1000);

const timeFilter = [
  { id: 0, value: 'All history' },
  { id: 1, value: 'Today', dateGap: 1  },
  { id: 2, value: 'Last 3 days', dateGap: 3 * TIME_IN_SECONDS.DAY },
  { id: 3, value: 'Last week', dateGap: TIME_IN_SECONDS.WEEK },
  { id: 4, value: 'Last month', dateGap: TIME_IN_SECONDS.MONTH  },
  { id: 5, value: 'Last 3 month', dateGap: 3 * TIME_IN_SECONDS.MONTH  },
  { id: 6, value: 'Last 6 month', dateGap: 6 * TIME_IN_SECONDS.MONTH  },
];

// PropsType
export type PropsType = {
  tabList: string[],
  currentTab: string,
  onTabChange: (tab: string) => void,
  setOrdersDateFilder: (filter: string) => void,
};

// Component
export const OrderListHeader: React.FC<PropsType> = (props) => {
  const { currentTab, onTabChange, tabList = [], setOrdersDateFilder } = props;

  // Declaration
  const [period, setPeriod] = React.useState(timeFilter[0]);
  const dispatch = useDispatch();

  const handlePeriodChange = (period) => {
    setPeriod(period);
    const nowDate = moment.now() / 1000;
    const dateFrom = (period.dateGap
      ? moment.unix(nowDate - period.dateGap)
      : startOfAll).startOf('day');
    setOrdersDateFilder(dateFrom.format('YYYY-MM-DD HH-mm-ss').toString());
  };

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
            onChange={handlePeriodChange}/>
        </div>
      </div>
    </>
  );
};

export default OrderListHeader;
