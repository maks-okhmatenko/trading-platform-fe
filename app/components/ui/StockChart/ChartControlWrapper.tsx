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
import chartZoomControllerBuilder from './zoomer';

const ChartControlPanel: React.FC<any> = props => {
  const { activeSymbolChart, activeTimeFrame, pickTimeFrame, zoom } = props;

  const buttonFrameTypes = Object.keys(FRAME_TYPES).map(
    item => FRAME_TYPES[item],
  );

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

  const zoomButtons = [
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
      <h2>{activeSymbolChart}</h2>
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
      chartData,
      additionalChartDataLength,
      activeTimeFrame,
      activeSymbolChart,
      loadMoreChartData,
    } = props;

    const sizerRef = useRef(null);
    const [chartNodeRef, setChartNode] = useState(null);
    const { width, height } = useInit(sizerRef, props);
    const zoomer = chartZoomControllerBuilder(chartNodeRef);
    const loadMoreHandler = (start, end) => {
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
    };
    // if(additionalChartDataLength === 0 && zoomer.reset) zoomer.reset();
    const chartProps = {
      ref: setChartNode,
      leftShift: -additionalChartDataLength,
      initialData: chartData,
      width,
      height,
      loadMoreHandler,
    };

    return (
      <>
        <ChartControlPanel {...props} zoom={zoomer} />
        <div className={styles.flexContainer}>
          <div ref={sizerRef}>
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

const useInit = (ref, props) => {
  const { activeTimeFrame, activeSymbolChart, subscribeChartData } = props;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth((ref.current && ref.current.clientWidth) || 0);
    setHeight((ref.current && ref.current.clientHeight) || 0);

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
  }, [activeTimeFrame, activeSymbolChart]);

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
