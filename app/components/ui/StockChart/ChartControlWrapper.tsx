import React, { ReactPropTypes } from 'react';
import styles from './Chart.scss';
const { useEffect, useRef, useState } = React;
import {
  FRAME_TYPES,
  TIME_FRAMES_CONFIG,
  getTimestamp,
  candlesLoad,
} from 'containers/App/constants';
import classnames from 'classnames';

const ChartControlPanel: React.FC<any> = (props) => {
  const buttonFrameTypes = Object.keys(FRAME_TYPES).map(
    item => FRAME_TYPES[item],
  );

  const timeframeButtonSetting = buttonFrameTypes.map((frameType, index) => {
    const classes = classnames(
      styles.timeFrameButton,
      frameType === props.activeTimeFrame ? styles.active : '',
    );
    return (
      <div
        className={classes}
        onClick={() => props.pickTimeFrame(frameType)}
        key={index}
      >
        {frameType}
      </div>
    );
  });

  return (
    <div className={styles.controller}>
      <h2>{props.activeSymbolChart}</h2>
      <div className={styles.buttonContainer}>{timeframeButtonSetting}</div>
    </div>
  );
};

const ChartControlWrapper = WrappedComponent => {
  return props => {
    const ref = useRef(null);
    const { width, height } = useResize(ref, props);
    const {
      chartData,
      additionalChartDataLength,
      activeTimeFrame,
      activeSymbolChart,
      subscribeChartData,
      loadMoreChartData,
    } = props;

    useEffect(() => {
      subscribeChartData({
        symbol: activeSymbolChart,
        frameType: activeTimeFrame,
        from: getTimestamp.subtract(
          TIME_FRAMES_CONFIG[activeTimeFrame].from * candlesLoad,
        ),
        to: getTimestamp.add(
          TIME_FRAMES_CONFIG[activeTimeFrame].to * candlesLoad,
        ),
      });
    }, [props.activeTimeFrame, props.activeSymbolChart]);

    const loadMoreHandler = (start, end) => {
      if (Math.ceil(start) === end) { return; }
      const startTimestamp = Date.parse(chartData[0].date) / 1000 - 1;
      const rowsToDownload = end - Math.ceil(start);

      loadMoreChartData({
        symbol: props.activeSymbolChart,
        frameType: props.activeTimeFrame,
        from: getTimestamp.subtract(TIME_FRAMES_CONFIG[props.activeTimeFrame].to * rowsToDownload, startTimestamp),
        to: getTimestamp.add(0, startTimestamp),
      });
    };

    const chartProps = {
      leftShift: -additionalChartDataLength,
      initialData: chartData,
      width,
      height,
      loadMoreHandler,
    };

    return (
      <>
        <ChartControlPanel {...props} />
        <div className={styles.flexContainer}>
          <div ref={ref}>
            {width > 300 && height > 300 && chartData.length > 0 ? (
              <WrappedComponent {...chartProps} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    );
  };
};

const useResize = (ref, props) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth((ref.current && ref.current.clientWidth) || 0);
    setHeight((ref.current && ref.current.clientHeight) || 0);
  }, [props]);

  useEffect(() => {
    const handleResize = () => {
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
