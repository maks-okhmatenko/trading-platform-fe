import React from 'react';
import styles from './Chart.scss';
const { useEffect, useRef, useState } = React;
import {
  FRAME_TYPES,
  TIME_FRAMES_CONFIG,
  getTimestamp,
} from 'containers/App/constants';

// Load the img icon and the file
import '!file-loader?name=[name].[ext]!../../../images/timeframes/M1_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/M5_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/M15_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/M30_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/H1_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/H4_timeframe_small.png';
import '!file-loader?name=[name].[ext]!../../../images/timeframes/D1_timeframe_small.png';

class FlexWrapper extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const buttonFrameTypes = Object.keys(FRAME_TYPES).map(
      item => FRAME_TYPES[item],
    );
    const timeframeButtonSetting = buttonFrameTypes.map((frameType, index) => (
      <img
        src={`./${frameType}_timeframe_small.png`}
        onClick={this.timeFrameChangeHandler(frameType)}
        width="50"
        key={index}
      />
    ));

    this.state = {
      timeframeButtonSetting,
    };
  }

  private timeFrameChangeHandler(frameType) {
    return () => {
      this.props.chooseTimeframeChartData({
        symbol: this.props.activeSymbolChart,
        frameType: frameType,
        from: getTimestamp.subtract(TIME_FRAMES_CONFIG[frameType].from),
        to: getTimestamp.add(TIME_FRAMES_CONFIG[frameType].to),
      });
    };
  }

  public render() {
    return (
      <div className={styles.buttonContainer}>
        {this.state.timeframeButtonSetting}
      </div>
    );
  }
}

const flexWrapper = WrappedComponent => {
  return props => {
    const componentRef = useRef(null);
    const { width, height } = useResize(componentRef, props);

    return (
      <>
        <FlexWrapper {...props} />
        <div className={styles.flexContainer}>
          <div ref={componentRef}>
            {width > 300 && height > 300 ? (
              <WrappedComponent {...props} width={width} height={height} />
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
    setWidth(ref.current.clientWidth);
    setHeight(ref.current.clientHeight);
  }, [props]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(ref.current.clientWidth);
      setHeight(ref.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return { width, height };
};

export default flexWrapper;
