import React, { ReactPropTypes } from 'react';
import styles from './Chart.scss';
const { useEffect, useRef, useState } = React;
import {
  FRAME_TYPES,
  TIME_FRAMES_CONFIG,
  getTimestamp,
  candlesLoad,
  CHANGE_TYPE,
} from 'containers/App/constants';
import classnames from 'classnames';
import _ from 'lodash';

const ChartControlPanel: React.FC<any> = props => {
  const { activeSymbolChart, activeTimeFrame, pickTimeFrame, zoom, openedSymbols, pickSymbolChart } = props;

  const buttonFrameTypes = Object.keys(FRAME_TYPES).map(
    item => FRAME_TYPES[item],
  );

  const closeSymbolChartHandler = (symbol) => (e) => {
    e.stopPropagation();
    pickSymbolChart(CHANGE_TYPE.DELETE , symbol);
  };

  const activeSymbolChartButtons = openedSymbols
  .map((symbol, idx) => {
    const classes = classnames(
      styles.tickerButton, {
      [styles.active] : activeSymbolChart === symbol,
    });
    return (
      <div className={classes} onClick={() => pickSymbolChart(CHANGE_TYPE.ADD , symbol)} key={idx}>
        <h4>{symbol}</h4>
        <div className={styles.closeButton} onClick={closeSymbolChartHandler(symbol)}>X</div>
      </div>
    );
  });

  const timeframeButtonSetting = buttonFrameTypes.map((frameType, index) => {
    const classes = classnames(
      styles.timeFrameButton, {
      [styles.active] : frameType === activeTimeFrame,
    });
    return (
      <div
        className={classes}
        onClick={() => pickTimeFrame(frameType)}
        key={index}
      >
        {frameType}
      </div>
    );
  });

  const zoomButtons = !zoom
    ? (<></>)
    : [
      { handler: zoom.in, value: 'Zoom +' },
      { handler: zoom.reset, value: 'Reset' },
      { handler: zoom.out, value: 'Zoom -' },
    ].map((item, idx) => (
      <div className={styles.chartZoomButton} onClick={item.handler} key={idx}>
        {item.value}
      </div>
    ));

  return (
    <div className={styles.controller}>
        <div className={styles.activeTickersRow}>
          <div className={styles.scrollable}>
              {activeSymbolChartButtons}
          </div>
        </div>
      <div className={styles.buttonContainer}>
        <div className={styles.buttonsRow}>{timeframeButtonSetting}</div>
        <div className={styles.buttonsRow}>
          {zoomButtons}
        </div>
      </div>
    </div>
  );
};

const ChartControlWrapper = WrappedComponent => {
  return props => {
    const {
      ticker,
      chartData,
      additionalChartDataLength,
      activeTimeFrame,
      activeSymbolChart,
      loadMoreChartData,
    } = props;

    const sizerRef = useRef(null);
    const [zoomer, setZoomer] = useState(null);
    const { width, height } = useInit(sizerRef, props, zoomer);
    const loadMoreHandler = _.debounce((start, end) => {
      if (Math.ceil(start) === end) {
        return;
      }

      const startTimestamp = Date.parse(chartData[0].date) / 1000 - 1;
      const rowsToDownload = end - Math.ceil(start);

      loadMoreChartData({
        symbol: activeSymbolChart,
        frameType: activeTimeFrame,
        count: rowsToDownload,
        to: getTimestamp.add(0, startTimestamp),
      });
    }, 100);

    const chartProps = {
      leftShift: -additionalChartDataLength,
      initialData: chartData,
      width,
      height: height - 70,
      loadMoreHandler,
      ticker,
      timeFrame: `${activeSymbolChart} ${activeTimeFrame}`,
    };

    return (
      <div className={styles.flexContainer} ref={sizerRef}>
        <div>
          <ChartControlPanel {...props} zoom={zoomer} />

            {width > 10 && height > 10 && chartData.length > 0 ? (
              <WrappedComponent {...chartProps} >
                {(props) => {
                  const { zoom } = props;
                  setZoomer(zoom);
                }}
              </WrappedComponent>
            ) : (
              <></>
            )}
        </div>
      </div>
    );
  };
};

const useInit = (ref, props, zoomer) => {
  const { activeTimeFrame, activeSymbolChart, subscribeChartData } = props;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (zoomer) {
      zoomer.reset();
    }

    setWidth((ref.current && ref.current.clientWidth) || 0);
    setHeight((ref.current && ref.current.clientHeight) || 0);

    subscribeChartData({
      symbol: activeSymbolChart,
      frameType: activeTimeFrame,
      count: candlesLoad * 0.5,
      to: getTimestamp.add(
        TIME_FRAMES_CONFIG[activeTimeFrame].to * candlesLoad,
      ),
    });
  }, [activeTimeFrame, activeSymbolChart]);

  useEffect(() => {
    const handleResize = () => {
      console.log('resize');
      setWidth((ref.current && ref.current.clientWidth) || 0);
      setHeight((ref.current && ref.current.clientHeight) || 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return { width, height };
};

export default ChartControlWrapper;
